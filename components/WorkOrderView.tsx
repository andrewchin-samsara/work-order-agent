import React, { useState } from 'react';
import { ChevronDown, MoreVertical, Plus, DollarSign, X, Check, FileText } from 'lucide-react';
import { WorkOrder, ServiceTask } from '../types';

interface WorkOrderViewProps {
  workOrder: WorkOrder;
  onOpenAgent: () => void;
}

export const WorkOrderView: React.FC<WorkOrderViewProps> = ({ workOrder, onOpenAgent }) => {
  return (
    <div className="flex-1 bg-samsara-bg overflow-y-auto">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-gray-600">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-900">Work order #{workOrder.id}</h1>
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                {workOrder.status}
              </span>
              <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded text-xs font-medium text-gray-700">
                <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-[10px]">MS</div>
                Michael Scott +2
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Created by {workOrder.createdBy} • {workOrder.createdDate}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
            <button className="p-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-600">
                <MoreVertical size={18} />
            </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-5xl mx-auto">
        
        {/* Warranty Banner */}
        <div className="bg-[#e7eff8] border border-blue-100 rounded-lg p-4 mb-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-samsara-navy rounded flex items-center justify-center text-white">
              <DollarSign size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">$3,200 is under warranty</h3>
              <p className="text-xs text-gray-600">We detected 3 items that are covered.</p>
            </div>
          </div>
          <button 
            onClick={onOpenAgent}
            className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 px-4 py-2 rounded text-sm font-semibold shadow-sm transition-colors flex items-center gap-2"
          >
            <SparklesIcon />
            Draft warranty with AI
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6 text-sm">
          <TabButton label="Details" />
          <TabButton label="Service task" count="$0.00" active />
          <TabButton label="Warranty" count="3" />
          <TabButton label="Purchase order" count="2" />
          <TabButton label="Cost" />
        </div>

        <button className="flex items-center gap-1 text-samsara-blue text-sm font-medium mb-4 hover:underline">
          <Plus size={16} /> Add service task
        </button>

        {/* Task List */}
        <div className="space-y-4">
          {workOrder.tasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>

      </main>
    </div>
  );
};

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="purple" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
)

const TabButton: React.FC<{ label: string; count?: string; active?: boolean }> = ({ label, count, active }) => (
  <button className={`px-4 py-2 flex items-center gap-2 border-b-2 transition-colors ${active ? 'border-gray-900 text-gray-900 font-medium' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
    {label}
    {count && <span className="bg-gray-200 text-gray-600 text-[10px] px-1.5 py-0.5 rounded-sm">{count}</span>}
  </button>
);

const TaskItem: React.FC<{ task: ServiceTask }> = ({ task }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Task Header */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center gap-3">
          <ChevronDown size={16} className={`text-gray-500 transform transition-transform ${isOpen ? '' : '-rotate-90'}`} />
          <div>
            <h3 className="font-bold text-gray-900 text-sm">{task.title}</h3>
            <p className="text-xs text-gray-500">{task.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-white border border-gray-300 text-blue-600 px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> {task.status}
          </span>
          <div className="bg-white border border-gray-300 px-2 py-0.5 rounded text-xs font-medium text-gray-700 flex items-center gap-1">
            Michael Scott <span className="bg-gray-100 px-1 rounded">+1</span>
          </div>
          <X size={16} className="text-gray-400" />
        </div>
      </div>

      {isOpen && (
        <div className="p-4 space-y-6">
          {/* Labor Section */}
          <div>
            <div className="flex items-center gap-2 mb-2">
                <ChevronDown size={12} className="text-gray-500" />
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Labor</h4>
                <span className="bg-gray-200 text-gray-600 text-[10px] px-1.5 rounded-full">{task.labor.length}</span>
            </div>
            
            <div className="grid grid-cols-12 gap-4 text-[10px] font-semibold text-gray-400 uppercase mb-1 px-1">
                <div className="col-span-4"></div>
                <div className="col-span-2">Hours</div>
                <div className="col-span-3">Hourly Rate</div>
                <div className="col-span-3">Subtotal</div>
            </div>

            <div className="space-y-2">
              {task.labor.map(labor => (
                <div key={labor.id} className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center text-xs">
                        {labor.technician.charAt(0)}
                    </div>
                    <div>
                        <div className="text-sm font-medium text-gray-900">{labor.technician}</div>
                        <div className="text-xs text-gray-400">{labor.timestamp}</div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 bg-white flex justify-between items-center">
                        {labor.hours.toFixed(1)} <ChevronDown size={12} className="text-gray-400"/>
                    </div>
                  </div>
                  <div className="col-span-3">
                    <div className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 bg-white flex items-center gap-1">
                        <span className="text-gray-400">$</span> {labor.rate}
                    </div>
                  </div>
                   <div className="col-span-3 flex items-center gap-2">
                    <div className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 bg-gray-50 flex-grow flex items-center gap-1">
                        <span className="text-gray-400">$</span> {(labor.hours * labor.rate).toFixed(2)}
                    </div>
                    <MoreVertical size={16} className="text-gray-400" />
                  </div>
                </div>
              ))}
              <button className="flex items-center gap-1 text-samsara-blue text-xs font-medium mt-1 hover:underline pl-11">
                <Plus size={14} /> Add labor
            </button>
            </div>
          </div>

          {/* Parts Section */}
          <div>
            <div className="flex items-center gap-2 mb-2">
                <ChevronDown size={12} className="text-gray-500" />
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Parts</h4>
                <span className="bg-gray-200 text-gray-600 text-[10px] px-1.5 rounded-full">{task.parts.length}</span>
            </div>
             <div className="grid grid-cols-12 gap-4 text-[10px] font-semibold text-gray-400 uppercase mb-1 px-1">
                <div className="col-span-4"></div>
                <div className="col-span-2">Quantity</div>
                <div className="col-span-3">Unit Price</div>
                <div className="col-span-3">Subtotal</div>
            </div>
            <div className="space-y-2">
              {task.parts.map(part => (
                <div key={part.id} className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-4 flex items-center gap-3">
                     <div className="w-8 h-8 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                        <div className="w-3 h-3 bg-gray-400 rounded-sm"></div>
                     </div>
                     <div>
                        <div className="text-sm font-medium text-gray-900">{part.name}</div>
                        <div className="text-xs text-gray-400">{part.sku}</div>
                     </div>
                  </div>
                   <div className="col-span-2">
                    <div className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 bg-white flex justify-between items-center">
                       <span className="text-transparent">.</span> <span className="text-gray-400 text-xs">ct.</span>
                    </div>
                  </div>
                  <div className="col-span-3">
                    <div className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 bg-white flex items-center gap-1">
                        <span className="text-gray-400">$</span> 
                    </div>
                  </div>
                   <div className="col-span-3 flex items-center gap-2">
                    <div className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 bg-white flex-grow flex items-center gap-1">
                        <span className="text-gray-400">$</span> 
                    </div>
                    <MoreVertical size={16} className="text-gray-400" />
                  </div>
                </div>
              ))}
               <button className="flex items-center gap-1 text-samsara-blue text-xs font-medium mt-1 hover:underline pl-11">
                <Plus size={14} /> Add part
            </button>
            </div>
          </div>

          {/* Codes Section */}
          <div>
            <div className="flex items-center gap-2 mb-2">
                <ChevronDown size={12} className="text-gray-500" />
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Codes</h4>
            </div>
            <div className="grid grid-cols-3 gap-4">
               <div>
                  <label className="text-[10px] font-semibold text-gray-500 uppercase mb-1 block">Work completed</label>
                  <div className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-500 bg-white flex justify-between items-center">
                        {task.codes.workCompleted} <ChevronDown size={14} />
                  </div>
               </div>
               <div>
                  <label className="text-[10px] font-semibold text-gray-500 uppercase mb-1 block">Repair</label>
                  <div className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-500 bg-white flex justify-between items-center">
                        {task.codes.repair} <ChevronDown size={14} />
                  </div>
               </div>
               <div>
                  <label className="text-[10px] font-semibold text-gray-500 uppercase mb-1 block">Failure</label>
                  <div className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-500 bg-white flex justify-between items-center">
                        {task.codes.failure} <ChevronDown size={14} />
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
