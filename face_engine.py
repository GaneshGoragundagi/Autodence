import os
import cv2
import numpy as np

def detect_faces_and_annotate(image_path, output_annotated_path):
    """
    Detects potential faces in the classroom group photo using OpenCV
    skin segmentation, morphological operations, and contour analysis.
    Draws bounding boxes and labels, saving to output_annotated_path.
    Returns: list of face bounding boxes [{'box': (x, y, w, h), 'crop': face_img_bgr}]
    """
    if not os.path.exists(image_path):
        return []

    img = cv2.imread(image_path)
    if img is None:
        return []

    h_orig, w_orig = img.shape[:2]
    # Resize for consistent processing while maintaining aspect ratio
    max_dim = 1200
    scale = 1.0
    if max(h_orig, w_orig) > max_dim:
        scale = max_dim / max(h_orig, w_orig)
        img_proc = cv2.resize(img, (int(w_orig * scale), int(h_orig * scale)))
    else:
        img_proc = img.copy()

    # Convert to YCrCb for skin tone segmentation
    ycrcb = cv2.cvtColor(img_proc, cv2.COLOR_BGR2YCrCb)
    # Standard human skin color thresholds in YCrCb color space
    lower_skin = np.array([0, 133, 77], dtype=np.uint8)
    upper_skin = np.array([255, 173, 127], dtype=np.uint8)
    mask = cv2.inRange(ycrcb, lower_skin, upper_skin)

    # Morphological operations to remove noise and bridge gaps
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    mask = cv2.erode(mask, kernel, iterations=1)
    mask = cv2.dilate(mask, kernel, iterations=2)
    mask = cv2.GaussianBlur(mask, (3, 3), 0)

    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    detected_faces = []
    annotated_img = img_proc.copy()

    min_area = (img_proc.shape[0] * img_proc.shape[1]) * 0.0015  # min 0.15% of frame
    max_area = (img_proc.shape[0] * img_proc.shape[1]) * 0.35

    box_idx = 1
    for cnt in contours:
        area = cv2.contourArea(cnt)
        if min_area < area < max_area:
            x, y, w, h = cv2.boundingRect(cnt)
            aspect_ratio = float(h) / max(w, 1)

            # Human faces / upper head contours typically have aspect ratios between 0.9 and 2.0
            if 0.8 <= aspect_ratio <= 2.2:
                # Add padding
                pad_w = int(w * 0.1)
                pad_h = int(h * 0.1)
                x1 = max(0, x - pad_w)
                y1 = max(0, y - pad_h)
                x2 = min(img_proc.shape[1], x + w + pad_w)
                y2 = min(img_proc.shape[0], y + h + pad_h)

                crop = img_proc[y1:y2, x1:x2]
                if crop.size > 0:
                    detected_faces.append({
                        'id': box_idx,
                        'box': (int(x1 / scale), int(y1 / scale), int((x2 - x1) / scale), int((y2 - y1) / scale)),
                        'crop': crop
                    })

                    # Draw stylish tech bounding box on annotated image
                    cv2.rectangle(annotated_img, (x1, y1), (x2, y2), (16, 185, 129), 2)  # Green
                    label = f"Face #{box_idx}"
                    cv2.putText(annotated_img, label, (x1, max(y1 - 8, 15)), 
                                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (16, 185, 129), 2)
                    box_idx += 1

    # Save annotated preview
    out_dir = os.path.dirname(output_annotated_path)
    if out_dir:
        os.makedirs(out_dir, exist_ok=True)
    cv2.imwrite(output_annotated_path, annotated_img)
    return detected_faces

def compute_similarity(crop1, crop2):
    """
    Computes visual and structural similarity between two face crops
    using normalized correlation and histogram comparison.
    Returns float score between 0.0 and 1.0.
    """
    try:
        # Resize both to standard 96x96
        target_size = (96, 96)
        img1 = cv2.resize(crop1, target_size)
        img2 = cv2.resize(crop2, target_size)

        gray1 = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY)
        gray2 = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)

        # Equalize histograms to normalize lighting
        gray1 = cv2.equalizeHist(gray1)
        gray2 = cv2.equalizeHist(gray2)

        # 1. Normalized Cross-Correlation
        res = cv2.matchTemplate(gray1, gray2, cv2.TM_CCOEFF_NORMED)
        template_score = float(res[0][0])  # [-1, 1]
        template_score = max(0.0, (template_score + 1.0) / 2.0)  # scale to [0, 1]

        # 2. Grayscale 2D Histogram Correlation
        hist1 = cv2.calcHist([gray1], [0], None, [32], [0, 256])
        hist2 = cv2.calcHist([gray2], [0], None, [32], [0, 256])
        cv2.normalize(hist1, hist1)
        cv2.normalize(hist2, hist2)
        hist_score = float(cv2.compareHist(hist1, hist2, cv2.HISTCMP_CORREL))
        hist_score = max(0.0, min(1.0, (hist_score + 1.0) / 2.0))

        # Weighted combination
        combined = (template_score * 0.6) + (hist_score * 0.4)
        return float(combined)
    except Exception:
        return 0.0

def process_classroom_attendance(group_photo_path, annotated_save_path, roster_students, upload_folder):
    """
    Executes the Phase 4 workflow:
    1. Detects faces in group photo.
    2. Compares detected faces against registered student photos in roster.
    3. Categorizes recognized, uncertain, and absent students.
    4. Detects unrecognized faces and duplicate matches.
    """
    detected_faces = detect_faces_and_annotate(group_photo_path, annotated_save_path)
    total_faces = len(detected_faces)

    results = []
    matched_student_ids = set()
    matched_face_ids = set()

    # Pre-load student face images
    student_crops = {}
    for student in roster_students:
        s_id = student['id']
        photo_filename = student['profile_photo']
        if photo_filename:
            p_path = os.path.join(upload_folder, photo_filename)
            if os.path.exists(p_path):
                img = cv2.imread(p_path)
                if img is not None:
                    student_crops[s_id] = img

    # Match detected faces with roster students
    student_best_match = {}
    for s_id, s_crop in student_crops.items():
        best_score = 0.0
        best_face_id = None
        for face in detected_faces:
            score = compute_similarity(s_crop, face['crop'])
            if score > best_score:
                best_score = score
                best_face_id = face['id']
        student_best_match[s_id] = (best_score, best_face_id)

    # Classify each student in roster
    duplicate_counter = {}
    for student in roster_students:
        s_id = student['id']
        has_photo = s_id in student_crops
        confidence = 0.0
        matched_face = None

        if has_photo:
            score, face_id = student_best_match.get(s_id, (0.0, None))
            # Convert to percentage
            confidence = round(score * 100, 1)
            matched_face = face_id

        # Confidence thresholds
        if confidence >= 65.0:
            status = 'Present'
            status_category = 'Recognized'
            matched_student_ids.add(s_id)
            if matched_face:
                matched_face_ids.add(matched_face)
                duplicate_counter[matched_face] = duplicate_counter.get(matched_face, 0) + 1
        elif 45.0 <= confidence < 65.0:
            status = 'Present'  # Provisional, teacher can review
            status_category = 'Uncertain'
            matched_student_ids.add(s_id)
            if matched_face:
                matched_face_ids.add(matched_face)
                duplicate_counter[matched_face] = duplicate_counter.get(matched_face, 0) + 1
        else:
            status = 'Absent'
            status_category = 'Not Detected'

        results.append({
            'student_id': s_id,
            'usn': student['usn'],
            'full_name': student['full_name'],
            'branch_code': student['branch_code'],
            'semester': student['semester'],
            'section': student['section'],
            'profile_photo': student['profile_photo'],
            'has_registered_photo': has_photo,
            'confidence': confidence,
            'status': status,
            'category': status_category,
            'matched_face_id': matched_face,
            'is_duplicate': False
        })

    # Flag duplicate match warnings
    for r in results:
        face_id = r.get('matched_face_id')
        if face_id and duplicate_counter.get(face_id, 0) > 1:
            r['is_duplicate'] = True

    # Count metrics
    unrecognized_faces = max(0, total_faces - len(matched_face_ids))
    present_count = sum(1 for r in results if r['status'] == 'Present')
    absent_count = sum(1 for r in results if r['status'] == 'Absent')
    recognized_count = sum(1 for r in results if r['category'] == 'Recognized')

    return {
        'total_faces_detected': total_faces,
        'matched_count': recognized_count,
        'unrecognized_faces': unrecognized_faces,
        'present_count': present_count,
        'absent_count': absent_count,
        'has_duplicates': any(v > 1 for v in duplicate_counter.values()),
        'results': results
    }
