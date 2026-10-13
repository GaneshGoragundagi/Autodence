import React, { useState } from 'react';
import { Student } from '../types';

interface StudentsViewProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onOpenAddModal: () => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  onSelectStudent,
  onEditStudent,
  onOpenAddModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'attendance-desc' | 'attendance-asc' | 'name'>('attendance-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeptMenu, setShowDeptMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.usn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDept = selectedDept === 'All' || student.department === selectedDept;

    return matchesSearch && matchesDept;
  });

  // Sort students
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortBy === 'attendance-desc') return b.attendanceRate - a.attendanceRate;
    if (sortBy === 'attendance-asc') return a.attendanceRate - b.attendanceRate;
    return a.name.localeCompare(b.name);
  });

  const itemsPerPage = 4;
  const totalPages = Math.max(1, Math.ceil(sortedStudents.length / itemsPerPage));
  const paginatedStudents = sortedStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col w-full gap-6 pb-20 relative">
      {/* Top Summary Stats & Quick Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-surface-container-low p-4 sm:p-5 rounded-2xl flex flex-col gap-1 shadow-xs border border-outline-variant/20">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-xs font-semibold">Total Students</span>
            <span className="material-symbols-outlined text-primary text-[20px]">group</span>
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-on-surface tabular-nums">148</span>
          <span className="text-xs text-status-present flex items-center gap-1 font-semibold">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            <span>+3 this sem</span>
          </span>
        </div>

        {/* Avg Attendance */}
        <div className="bg-surface-container-low p-4 sm:p-5 rounded-2xl flex flex-col gap-1 shadow-xs border border-outline-variant/20">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-xs font-semibold">Avg Attendance</span>
            <span className="material-symbols-outlined text-status-present text-[20px]">verified</span>
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-on-surface tabular-nums">88.4%</span>
          <span className="text-xs text-status-present font-semibold">Optimal threshold</span>
        </div>

        {/* At Risk */}
        <div className="bg-surface-container-low p-4 sm:p-5 rounded-2xl flex flex-col gap-1 shadow-xs border border-outline-variant/20">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-xs font-semibold">At Risk (&lt; 75%)</span>
            <span className="material-symbols-outlined text-status-absent text-[20px]">warning</span>
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-error tabular-nums">12</span>
          <span className="text-xs text-status-absent font-semibold">Requires notice</span>
        </div>

        {/* AI Sync Status */}
        <div className="bg-surface-container-low p-4 sm:p-5 rounded-2xl flex flex-col gap-1 shadow-xs border border-outline-variant/20">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-xs font-semibold">AI Sync Status</span>
            <span className="material-symbols-outlined text-primary text-[20px]">face</span>
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-on-surface tabular-nums">99.2%</span>
          <span className="text-xs text-on-surface-variant font-medium">Facial models active</span>
        </div>
      </div>

      {/* Search and Filtering Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
            search
          </span>
          <input 
            type="text" 
            placeholder="Search by name, USN, or email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-surface-container-low pl-10 pr-4 py-3 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary transition-all font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface text-xs"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          {/* Department filter */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowDeptMenu(!showDeptMenu);
                setShowSortMenu(false);
              }}
              className="flex items-center gap-1.5 bg-surface-container-low hover:bg-surface-container px-4 py-3 rounded-xl text-on-surface text-xs font-semibold border border-outline-variant/20 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
              <span>{selectedDept === 'All' ? 'Filter Dept' : `Dept: ${selectedDept}`}</span>
            </button>
            {showDeptMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-surface-container-lowest rounded-xl shadow-xl z-20 py-1.5 border border-outline-variant/30">
                {['All', 'CSE', 'ECE', 'ME', 'ISE'].map(dept => (
                  <button
                    key={dept}
                    onClick={() => {
                      setSelectedDept(dept);
                      setShowDeptMenu(false);
                      setCurrentPage(1);
                    }}
                    className={`w-full px-4 py-2 text-left text-xs font-medium ${
                      selectedDept === dept ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    {dept === 'All' ? 'All Departments' : dept}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort selector */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowSortMenu(!showSortMenu);
                setShowDeptMenu(false);
              }}
              className="flex items-center gap-1.5 bg-surface-container-low hover:bg-surface-container px-4 py-3 rounded-xl text-on-surface text-xs font-semibold border border-outline-variant/20 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">sort</span>
              <span>Sort</span>
            </button>
            {showSortMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-surface-container-lowest rounded-xl shadow-xl z-20 py-1.5 border border-outline-variant/30">
                <button
                  onClick={() => {
                    setSortBy('attendance-desc');
                    setShowSortMenu(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-xs font-medium ${
                    sortBy === 'attendance-desc' ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  Highest Attendance
                </button>
                <button
                  onClick={() => {
                    setSortBy('attendance-asc');
                    setShowSortMenu(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-xs font-medium ${
                    sortBy === 'attendance-asc' ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  Lowest Attendance (At-Risk)
                </button>
                <button
                  onClick={() => {
                    setSortBy('name');
                    setShowSortMenu(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-xs font-medium ${
                    sortBy === 'name' ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  Student Name (A-Z)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Student List Container */}
      <div className="flex flex-col gap-3">
        {paginatedStudents.length === 0 ? (
          <div className="p-12 text-center bg-surface-container-low rounded-2xl border border-outline-variant/30">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant">person_search</span>
            <p className="text-sm font-semibold text-on-surface mt-2">No students found</p>
            <p className="text-xs text-on-surface-variant mt-1">Try resetting your filters or search keywords</p>
          </div>
        ) : (
          paginatedStudents.map((student) => {
            const isAtRisk = student.attendanceRate < 75;
            return (
              <div 
                key={student.id}
                className="bg-surface-container-low rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs border border-outline-variant/20 hover:shadow-sm hover:border-primary/40 transition-all relative overflow-hidden"
              >
                {/* Visual left indicator bar for low attendance as shown in Image 8 */}
                {isAtRisk && (
                  <div className="absolute left-0 inset-y-0 w-1.5 bg-status-absent" />
                )}

                <div className={`flex items-center gap-3.5 w-full sm:w-auto ${isAtRisk ? 'pl-2' : ''}`}>
                  <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-surface-container ring-2 ring-outline-variant/30">
                    <img 
                      src={student.avatar} 
                      alt={student.name}
                      className="w-full h-full object-cover"
                    />
                    <div 
                      className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ring-2 ring-surface-container-low ${
                        isAtRisk ? 'bg-status-absent' : 'bg-status-present'
                      }`} 
                    />
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm sm:text-base text-on-surface truncate">
                        {student.name}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-primary-fixed text-on-primary-fixed">
                        {student.department} - {student.semester}
                      </span>
                      {isAtRisk && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] bg-error-container text-on-error-container flex items-center gap-1 font-bold">
                          <span className="material-symbols-outlined text-[12px]">warning</span>
                          <span>At Risk</span>
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-on-surface-variant font-mono truncate mt-0.5">
                      USN: {student.usn} • {student.email}
                    </span>
                  </div>
                </div>

                <div className={`flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-outline-variant/20 ${isAtRisk ? 'pl-2 sm:pl-0' : ''}`}>
                  <div className="flex flex-col sm:items-end">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                      isAtRisk 
                        ? 'bg-status-absent/15 text-status-absent' 
                        : 'bg-status-present/15 text-status-present'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isAtRisk ? 'bg-status-absent' : 'bg-status-present'}`} />
                      <span>{student.attendanceRate}%</span>
                    </span>
                    <span className="text-xs text-on-surface-variant mt-1">
                      Present: {student.totalPresent} • Absent: {student.totalAbsent}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => onSelectStudent(student)}
                      className="w-10 h-10 rounded-xl bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-colors"
                      title="View Details"
                    >
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </button>
                    <button 
                      onClick={() => onEditStudent(student)}
                      className="w-10 h-10 rounded-xl bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-colors"
                      title="Edit Student"
                    >
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <span className="text-xs text-on-surface-variant">
          Showing <span className="font-bold text-on-surface">{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, sortedStudents.length)}</span> of <span className="font-bold text-on-surface">{sortedStudents.length}</span> students
        </span>

        <div className="flex items-center gap-1">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="px-3 py-1.5 rounded-xl bg-surface-container-low text-on-surface-variant hover:bg-surface-container text-xs font-semibold transition-all disabled:opacity-40"
          >
            Previous
          </button>
          
          {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map(pageNum => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`w-9 h-9 rounded-xl font-semibold text-xs flex items-center justify-center transition-all ${
                currentPage === pageNum 
                  ? 'bg-primary text-white shadow-xs' 
                  : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
              }`}
            >
              {pageNum}
            </button>
          ))}

          {totalPages > 3 && <span className="px-1 text-on-surface-variant text-xs">...</span>}

          {totalPages > 3 && (
            <button
              onClick={() => setCurrentPage(totalPages)}
              className={`w-9 h-9 rounded-xl font-semibold text-xs flex items-center justify-center transition-all ${
                currentPage === totalPages 
                  ? 'bg-primary text-white shadow-xs' 
                  : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
              }`}
            >
              {totalPages}
            </button>
          )}

          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="px-3 py-1.5 rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container text-xs font-semibold transition-all disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      {/* Floating Action Button for Quick Add */}
      <div className="fixed bottom-24 lg:bottom-10 right-6 z-30">
        <button 
          onClick={onOpenAddModal}
          className="bg-primary hover:bg-primary-container text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
          title="Enroll New Student"
        >
          <span className="material-symbols-outlined text-[26px]">person_add</span>
        </button>
      </div>
    </div>
  );
};
