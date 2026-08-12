import React, { useState } from 'react';
import { Users, UserPlus, MessageSquare, Send, CheckCircle2, Circle } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  status: 'active' | 'offline';
}

interface Task {
  id: number;
  title: string;
  assignee: string;
  status: 'todo' | 'in_progress' | 'completed';
  tenderTitle: string;
}

interface Comment {
  user: string;
  text: string;
  timestamp: string;
}

export const TeamCollaboration: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Verify Solvency Letters for DMRC Viaduct', assignee: 'Deepak (Manager)', status: 'in_progress', tenderTitle: 'Elevated Viaduct Line-9' },
    { id: 2, title: 'Upload expired ISO 9001 quality cert to vault', assignee: 'Aditi (Estimator)', status: 'completed', tenderTitle: 'Western Zone Track Renewals' },
    { id: 3, title: 'Review Defect Liability DLP Clause contradictions', assignee: 'Vivek (Legal Counsel)', status: 'todo', tenderTitle: 'Nagpur High Court Annex' },
    { id: 4, title: 'Submit EMD Receipt and verify credit approvals', assignee: 'Deepak (Manager)', status: 'todo', tenderTitle: 'Dwarka Expressway flyover' }
  ]);

  const [comments, setComments] = useState<Comment[]>([
    { user: 'Aditi', text: 'Renewed the ISO 9001 cert and verified match. Readiness score recalculated to 86%!', timestamp: '20 mins ago' },
    { user: 'Vivek', text: 'Checked Nagpur HC Annex DLP. It contains a page conflict of 2 years vs 3 years. Suggested pre-bid meeting draft copy is generated.', timestamp: '1 hour ago' },
    { user: 'Deepak', text: 'Assigned Dwarka Highway project value checks to estimator teams. Turnover margins look solid.', timestamp: '3 hours ago' }
  ]);

  const [newComment, setNewComment] = useState('');

  const members: TeamMember[] = [
    { name: 'Deepak Kumar', role: 'Head of Bid Proposals', avatar: 'DK', status: 'active' },
    { name: 'Aditi Sharma', role: 'Chief Cost Estimator', avatar: 'AS', status: 'active' },
    { name: 'Vivek Mehta', role: 'General Legal Counsel', avatar: 'VM', status: 'active' },
    { name: 'Anjali Rao', role: 'Compliance Officer', avatar: 'AR', status: 'offline' }
  ];

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments([
      { user: 'You (Manager)', text: newComment, timestamp: 'Just now' },
      ...comments
    ]);
    setNewComment('');
  };

  const handleToggleTask = (id: number) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: t.status === 'completed' ? 'in_progress' : 'completed'
        };
      }
      return t;
    }));
  };

  return (
    <div className="space-y-8 select-none text-left">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#334155] pb-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#6366F1] p-2.5 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#F8FAFC]">Team Collaboration Workspace</h2>
            <p className="text-xs text-[#94A3B8]">Coordinate bid checklists, safety assignments, and audit discussion feeds</p>
          </div>
        </div>
        <button className="bg-[#6366F1] hover:bg-indigo-600 text-white rounded-lg px-4 py-2 text-xs font-bold transition-all flex items-center gap-1.5">
          <UserPlus size={13} />
          Invite Associate
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Tasks board (2-span) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111827] border border-[#334155] rounded-xl p-6 space-y-4">
            <h3 className="font-bold text-xs text-[#F8FAFC] uppercase tracking-wider flex items-center gap-2">
              <Users size={16} className="text-[#6366F1]" />
              Technical Bid Checklists
            </h3>
            
            <div className="divide-y divide-[#334155]/60 space-y-4 pt-2">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-start justify-between gap-4 pt-4 first:pt-0 text-xs">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className="mt-0.5 text-slate-500 hover:text-indigo-400 shrink-0"
                    >
                      {task.status === 'completed' ? (
                        <CheckCircle2 size={16} className="text-[#10B981]" />
                      ) : (
                        <Circle size={16} />
                      )}
                    </button>
                    <div>
                      <span className={`font-bold block ${task.status === 'completed' ? 'line-through text-slate-500' : 'text-[#F8FAFC]'}`}>
                        {task.title}
                      </span>
                      <span className="text-[10px] text-slate-550 block mt-1">
                        Tender: <strong className="text-slate-400 font-semibold">{task.tenderTitle}</strong> • Assignee: {task.assignee}
                      </span>
                    </div>
                  </div>
                  
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    task.status === 'completed' 
                      ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20'
                      : task.status === 'in_progress'
                        ? 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20'
                        : 'bg-[#0F172A] text-slate-500 border border-[#334155]'
                  }`}>
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Comment discussion board */}
          <div className="bg-[#111827] border border-[#334155] rounded-xl p-6 space-y-4">
            <h3 className="font-bold text-xs text-[#F8FAFC] uppercase tracking-wider flex items-center gap-2">
              <MessageSquare size={16} className="text-[#6366F1]" />
              Internal Bid Operations Feed
            </h3>

            <form onSubmit={handlePostComment} className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Post operational update to team channel..."
                className="flex-1 bg-[#1E293B] border border-[#334155] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] outline-none"
              />
              <button
                type="submit"
                className="bg-[#6366F1] hover:bg-indigo-650 text-white rounded-lg px-4 py-2 text-xs font-bold transition-all"
              >
                <Send size={13} />
              </button>
            </form>

            <div className="space-y-4 pt-2 max-h-[300px] overflow-y-auto">
              {comments.map((comment, index) => (
                <div key={index} className="bg-[#1E293B] border border-[#334155] p-4 rounded-xl text-left text-xs space-y-1.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-[#F8FAFC]">{comment.user}</span>
                    <span className="text-slate-500 font-mono">{comment.timestamp}</span>
                  </div>
                  <p className="text-[#94A3B8] leading-relaxed">{comment.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Member rosters (1-span) */}
        <div className="space-y-6 text-left">
          <div className="bg-[#111827] border border-[#334155] rounded-xl p-6 space-y-4">
            <span className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider block">Assigned Officers</span>
            <div className="space-y-4">
              {members.map((member) => (
                <div key={member.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-[#334155] flex items-center justify-center font-bold text-indigo-400">
                      {member.avatar}
                    </div>
                    <div>
                      <span className="font-bold text-[#F8FAFC] block">{member.name}</span>
                      <span className="text-[10px] text-slate-550 block mt-0.5">{member.role}</span>
                    </div>
                  </div>

                  <span className="relative flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      member.status === 'active' ? 'bg-emerald-400' : 'bg-slate-400'
                    }`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${
                      member.status === 'active' ? 'bg-emerald-500' : 'bg-slate-500'
                    }`}></span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
