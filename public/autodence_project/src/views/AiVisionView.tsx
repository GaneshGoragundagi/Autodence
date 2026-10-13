import React, { useState, useRef } from 'react';
import { CLASSROOM_PHOTO_URL, MOCK_BOUNDING_BOXES } from '../data/mockData';
import { Student } from '../types';

interface AiVisionViewProps {
  students: Student[];
  onSaveAttendance: (summary: { present: number; absent: number; course: string }) => void;
}

export const AiVisionView: React.FC<AiVisionViewProps> = ({
  students,
  onSaveAttendance
}) => {
  const [selectedClass, setSelectedClass] = useState('CS-301: Advanced AI');
  const [sessionDate, setSessionDate] = useState('2025-10-24');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(true); // default true so user immediately sees rich mockup from Image 6!
  const [imageSrc, setImageSrc] = useState(CLASSROOM_PHOTO_URL);
  const [activeBoxId, setActiveBoxId] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'present' | 'absent'>('all');

  // Local state for the students in this review batch
  const [reviewList, setReviewList] = useState([
    {
      id: 'rev-1',
      name: 'Alex Rivera',
      usn: '1BM21CS014',
      matchScore: 98,
      status: 'present',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNGPGeauQeWcaJ0rO7Xi-e7z6E3U7Ezl77vC83veuuhGlBEwZEZh0E1Ub_3plLel7m_NV1n9hz5e1aZDvDBm179_0v12ODjEqxUBlHlrOGCpZ8sqsyPnTks7615HEzEHttoR8V1eCJRZbA9OfuFDs6JCU2Rz4FwF8n14DF25VBExyHIh-ohqQGKmSiFXAFeC21izhpQNp8Hj12G5D97OTU81miiO4EjmQENp11_Nq_vnDokJG9bC5PjA',
      isUnknown: false
    },
    {
      id: 'rev-2',
      name: 'Samantha Wu',
      usn: '1BM21CS045',
      matchScore: 95,
      status: 'present',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJ1uDO7UqjbtNAvwgpwIBUhalBGs4_pRAZ-Tpmjnj94AdwC5CBORIhrN295uvJfJVWx7HFssamWNlf2q9DGWDLCv6KileIcQIcdu55tw65fRVoG5_N6z2F1FTGbfQdzEFg4iUhuNx8J_89XfOtgIZwGWjKPSHQSVCkbNPInao3WJ5va1MDSIqfoTrs3VCWRonsYZSKy2lrxlMyDyzow0T2ZmJepWLuffNF1hbFiDJ_QJoXMDhNHSwICA',
      isUnknown: false
    },
    {
      id: 'rev-3',
      name: 'Unknown Student #3',
      usn: 'Unrecognized Face',
      matchScore: 42,
      status: 'absent',
      avatar: '',
      isUnknown: true
    }
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleToggleStudent = (id: string) => {
    setReviewList(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, status: item.status === 'present' ? 'absent' : 'present' }
          : item
      )
    );
  };

  const handleResolveUnknown = (id: string, studentName: string) => {
    setReviewList(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              name: studentName,
              usn: '1BM22EC042 (Manual Match)',
              status: 'present',
              matchScore: 88,
              isUnknown: false
            }
          : item
      )
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageSrc(event.target.result as string);
          triggerAnalysis();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasAnalyzed(true);
      if (previewRef.current) {
        previewRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 1200);
  };

  const handleSave = () => {
    const presentCount = reviewList.filter(s => s.status === 'present').length + 53; // simulate full class 58
    const absentCount = reviewList.filter(s => s.status === 'absent').length + 2;
    onSaveAttendance({
      present: presentCount,
      absent: absentCount,
      course: selectedClass.split(':')[0]
    });
  };

  const filteredReviewList = reviewList.filter(s => {
    if (selectedFilter === 'present') return s.status === 'present';
    if (selectedFilter === 'absent') return s.status === 'absent';
    return true;
  });

  return (
    <div className="flex flex-col w-full gap-6 pb-16">
      {/* Header / Intro Banner */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface">
            AI Group-Photo Vision
          </h1>
          <span className="px-3 py-1 rounded-full bg-primary-container text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs">
            <span className="material-symbols-outlined text-[16px]">bolt</span>
            <span>Neural Net v4.2</span>
          </span>
        </div>
        <p className="text-sm text-on-surface-variant">
          Upload classroom group photos for instant facial recognition attendance mapping.
        </p>
      </div>

      {/* Configuration & Upload Card */}
      <div className="flex flex-col bg-surface-container-low rounded-2xl p-5 sm:p-6 shadow-xs border border-outline-variant/30 gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Class Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-on-surface-variant font-semibold">Select Class</label>
            <div className="relative">
              <select 
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full h-11 px-3.5 bg-surface rounded-xl text-on-surface text-sm appearance-none outline-none focus:ring-2 focus:ring-primary border border-outline-variant/30 transition-all font-medium"
              >
                <option value="CS-301: Advanced AI">CS-301: Advanced AI</option>
                <option value="CS-302: Data Structures">CS-302: Data Structures</option>
                <option value="EC-401: VLSI Design">EC-401: VLSI Design</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          {/* Date Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-on-surface-variant font-semibold">Session Date</label>
            <div className="relative">
              <input 
                type="date" 
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                className="w-full h-11 px-3.5 bg-surface rounded-xl text-on-surface text-sm outline-none focus:ring-2 focus:ring-primary border border-outline-variant/30 transition-all font-medium"
              />
            </div>
          </div>
        </div>

        {/* Drag & Drop Zone */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center border-2 border-dashed border-outline-variant hover:border-primary bg-surface/60 rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-16 h-16 rounded-full bg-primary-container text-white flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[32px]">cloud_upload</span>
          </div>
          <span className="text-base sm:text-lg font-bold text-on-surface mb-1">
            Drag & Drop Group Photo Here
          </span>
          <span className="text-xs text-on-surface-variant mb-4">
            Supports high-res JPEG, PNG up to 50MB
          </span>

          <div className="flex items-center gap-3">
            <button 
              type="button"
              className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-semibold shadow-xs hover:bg-primary-container transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">folder_open</span>
              <span>Browse Files</span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setImageSrc(CLASSROOM_PHOTO_URL);
                triggerAnalysis();
              }}
              className="px-3 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">replay</span>
              <span>Load Sample Lecture</span>
            </button>
          </div>

          <input 
            ref={fileInputRef}
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            className="hidden" 
          />
        </div>

        {/* Analyze Button */}
        <button 
          onClick={triggerAnalysis}
          disabled={isAnalyzing}
          className="w-full h-12 bg-primary text-white rounded-xl text-sm font-semibold shadow-md hover:bg-primary-container active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
              <span>Analyzing Biometric Telemetry & Embeddings...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
              <span>Analyze Group Photo</span>
            </>
          )}
        </button>
      </div>

      {/* AI Processing State & Bounding Box Preview */}
      {hasAnalyzed && (
        <div ref={previewRef} className="flex flex-col bg-surface-container-low rounded-2xl p-5 sm:p-6 shadow-xs border border-outline-variant/30 gap-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-base sm:text-lg font-bold text-on-surface">Detection Preview</span>
              <p className="text-xs text-on-surface-variant">Hover over faces to inspect biometric recognition bounding boxes</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-status-present/15 text-status-present text-xs font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-status-present animate-pulse" />
                <span>Processed Successfully</span>
              </span>
            </div>
          </div>

          {/* Image with Interactive Bounding Boxes */}
          <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden bg-surface-container shadow-inner border border-outline-variant/30">
            <img 
              src={imageSrc} 
              alt="Classroom Lecture Hall Capture"
              className="w-full h-full object-cover filter brightness-95"
            />

            {/* Mock Bounding Box Overlays */}
            {MOCK_BOUNDING_BOXES.map((box) => {
              const isSelected = activeBoxId === box.id;
              const isMatch = box.status === 'present';
              return (
                <div
                  key={box.id}
                  onClick={() => setActiveBoxId(isSelected ? null : box.id)}
                  style={{
                    top: box.top,
                    left: box.left,
                    width: box.width,
                    height: box.height
                  }}
                  className={`absolute rounded cursor-pointer transition-all border-2 flex items-start justify-end p-1 select-none ${
                    isMatch 
                      ? 'border-status-present bg-status-present/15 hover:bg-status-present/25'
                      : 'border-status-absent bg-status-absent/15 hover:bg-status-absent/25'
                  } ${isSelected ? 'ring-4 ring-white shadow-lg scale-105 z-20' : 'z-10'}`}
                >
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold text-white shadow-xs ${
                    isMatch ? 'bg-status-present' : 'bg-status-absent'
                  }`}>
                    {box.confidence}%
                  </span>

                  {/* Tooltip on active */}
                  {isSelected && (
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap shadow-xl z-30">
                      {box.studentName} ({box.confidence}%)
                    </div>
                  )}
                </div>
              );
            })}

            {/* Bottom Floating Stats Strip */}
            <div className="absolute bottom-3 inset-x-3 sm:inset-x-6 bg-surface/90 backdrop-blur-md rounded-xl p-3 flex justify-around items-center text-center border border-outline-variant/30 shadow-md">
              <div className="flex flex-col">
                <span className="text-[11px] text-on-surface-variant font-medium">Detected Faces</span>
                <span className="text-base sm:text-xl font-bold text-on-surface tabular-nums">58</span>
              </div>
              <div className="w-px h-8 bg-outline-variant/40" />
              <div className="flex flex-col">
                <span className="text-[11px] text-on-surface-variant font-medium">Matched</span>
                <span className="text-base sm:text-xl font-bold text-status-present tabular-nums">55</span>
              </div>
              <div className="w-px h-8 bg-outline-variant/40" />
              <div className="flex flex-col">
                <span className="text-[11px] text-on-surface-variant font-medium">Unrecognized</span>
                <span className="text-base sm:text-xl font-bold text-status-absent tabular-nums">3</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Review Table Section */}
      <div className="flex flex-col bg-surface-container-low rounded-2xl p-5 sm:p-6 shadow-xs border border-outline-variant/30 gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold text-on-surface">Attendance Review</span>
            <span className="text-xs text-on-surface-variant">Verify AI matches and resolve unrecognized students</span>
          </div>

          <div className="flex items-center gap-1 bg-surface p-1 rounded-xl border border-outline-variant/30">
            <button 
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedFilter === 'all' 
                  ? 'bg-primary text-white shadow-xs' 
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Filter All
            </button>
            <button 
              onClick={() => setSelectedFilter('present')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedFilter === 'present' 
                  ? 'bg-primary text-white shadow-xs' 
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Present
            </button>
            <button 
              onClick={() => setSelectedFilter('absent')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedFilter === 'absent' 
                  ? 'bg-primary text-white shadow-xs' 
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Unrecognized
            </button>
          </div>
        </div>

        {/* Student List / Table Cards */}
        <div className="flex flex-col gap-3">
          {filteredReviewList.map((item) => (
            <div 
              key={item.id}
              className="flex items-center justify-between bg-surface rounded-xl p-3.5 sm:p-4 shadow-xs border border-outline-variant/20 hover:border-primary/40 transition-all gap-3"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {item.avatar ? (
                  <img 
                    src={item.avatar} 
                    alt={item.name}
                    className="w-11 h-11 rounded-full object-cover shrink-0 ring-2 ring-primary/20"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant shrink-0">
                    <span className="material-symbols-outlined text-[22px]">question_mark</span>
                  </div>
                )}
                
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-on-surface truncate">
                    {item.name}
                  </span>
                  <span className="text-xs text-on-surface-variant truncate">
                    {item.isUnknown ? (
                      <span className="text-status-absent font-semibold">
                        Unrecognized Face • {item.matchScore}% Match
                      </span>
                    ) : (
                      <span>USN: {item.usn} • {item.matchScore}% Match</span>
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {item.isUnknown ? (
                  <button
                    onClick={() => handleResolveUnknown(item.id, 'Marcus Brody')}
                    className="px-2.5 py-1 text-xs font-semibold bg-primary-fixed text-on-primary-fixed hover:bg-primary-fixed-dim rounded-lg transition-colors hidden sm:block"
                  >
                    Assign Marcus
                  </button>
                ) : null}

                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  item.status === 'present'
                    ? 'bg-status-present/15 text-status-present'
                    : 'bg-status-absent/15 text-status-absent'
                }`}>
                  {item.status === 'present' ? 'Present' : 'Absent'}
                </span>

                {/* Custom Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={item.status === 'present'} 
                    onChange={() => handleToggleStudent(item.id)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 pt-2">
        <button 
          onClick={() => {
            const el = document.getElementById('student-review-scroll');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex-1 h-12 bg-surface-container-high text-on-surface rounded-xl text-sm font-semibold hover:bg-surface-variant transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">rate_review</span>
          <span>Review Attendance</span>
        </button>

        <button 
          onClick={handleSave}
          className="flex-1 h-12 bg-primary text-white rounded-xl text-sm font-semibold shadow-md hover:bg-primary-container active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>Confirm & Save</span>
        </button>
      </div>
    </div>
  );
};
