import React from 'react';
import { ArrowLeft, Calendar, Plus, Minus, Info, X, ChevronDown, Check } from 'lucide-react';
import { ClaimData, WorkOrder } from '../types';

interface ClaimDraftViewProps {
  claimData: ClaimData;
  onBack: () => void;
  onOpenAgent: () => void;
}

export const ClaimDraftView: React.FC<ClaimDraftViewProps> = ({ claimData, onBack, onOpenAgent }) => {
  return (
    <div className="flex-1 bg-samsara-bg overflow-y-auto pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-gray-400 hover:text-gray-600">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-900">New claim</h1>
              <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                Draft
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Created by {claimData.createdBy} • {claimData.createdDate}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
             <div className="text-xs text-gray-500 uppercase font-semibold">Requested</div>
             <div className="text-lg font-bold text-gray-900">${claimData.totalAmount.toFixed(2)}</div>
          </div>
          <button className="bg-samsara-blue hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors">
            Submit
          </button>
          <button 
            onClick={onOpenAgent}
            className="flex items-center gap-1 text-gray-700 hover:text-gray-900 font-medium text-sm"
          >
             Samsara Assistant <ChevronDown size={14} />
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        
        {/* Row 1: Asset & Failure Info */}
        <div className="grid grid-cols-2 gap-6">
            {/* Asset Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-1">
                    Asset details <span className="text-red-500">*</span>
                </h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Asset</label>
                        <div className="relative">
                            <select className="block w-full appearance-none bg-white border border-gray-300 hover:border-gray-400 px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm">
                                <option>R321 ({claimData.vehicleName})</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">VIN</label>
                        <input type="text" value="32512051" readOnly className="block w-full bg-gray-50 border border-gray-300 px-3 py-2 rounded shadow-sm text-sm text-gray-600" />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Odometer</label>
                         <div className="relative">
                            <input type="text" value={claimData.odometer} readOnly className="block w-full bg-white border border-gray-300 px-3 py-2 rounded shadow-sm text-sm" />
                            <span className="absolute right-3 top-2 text-gray-400 text-xs">mi</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Engine hour</label>
                        <div className="relative">
                            <input type="text" value={claimData.engineHours} readOnly className="block w-full bg-white border border-gray-300 px-3 py-2 rounded shadow-sm text-sm" />
                            <span className="absolute right-3 top-2 text-gray-400 text-xs">hr</span>
                        </div>
                    </div>
                     <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Warranty</label>
                        <div className="relative">
                            <select className="block w-full appearance-none bg-white border border-gray-300 hover:border-gray-400 px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm">
                                <option>{claimData.vehicleName} 2024</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Failure Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                 <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-1">
                    Failure Information <span className="text-red-500">*</span>
                </h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                     <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Failure date</label>
                        <div className="relative">
                             <input type="text" value={claimData.failureDate} readOnly className="block w-full bg-white border border-gray-300 px-3 py-2 rounded shadow-sm text-sm" />
                             <Calendar size={14} className="absolute right-3 top-2.5 text-gray-400" />
                        </div>
                     </div>
                     <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Repair date</label>
                        <div className="relative">
                             <input type="text" value={claimData.repairDate} readOnly className="block w-full bg-white border border-gray-300 px-3 py-2 rounded shadow-sm text-sm" />
                             <Calendar size={14} className="absolute right-3 top-2.5 text-gray-400" />
                        </div>
                     </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Concern</label>
                        <textarea rows={4} className="block w-full bg-white border border-gray-300 px-3 py-2 rounded shadow-sm text-sm focus:outline-none focus:border-blue-500" value={claimData.threeCs.concern} readOnly />
                    </div>
                     <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Cause</label>
                        <textarea rows={4} className="block w-full bg-white border border-gray-300 px-3 py-2 rounded shadow-sm text-sm focus:outline-none focus:border-blue-500" value={claimData.threeCs.cause} readOnly />
                    </div>
                     <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Correction</label>
                        <textarea rows={4} className="block w-full bg-white border border-gray-300 px-3 py-2 rounded shadow-sm text-sm focus:outline-none focus:border-blue-500" value={claimData.threeCs.correction} readOnly />
                    </div>
                </div>
            </div>
        </div>

        {/* Claims (Service Tasks) */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
             <h3 className="text-base font-bold text-gray-900 mb-4">Claims</h3>
             <div className="mb-4">
                 <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Work order</label>
                 <div className="relative">
                    <div className="flex items-center gap-2 bg-white border border-gray-300 px-3 py-2 rounded shadow-sm text-sm w-full">
                        <span className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded">WO{claimData.workOrderId}</span>
                    </div>
                    <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                 </div>
             </div>

             <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Service tasks</label>
                <div className="space-y-2">
                    <div className="flex items-start gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <div className="mt-0.5 bg-blue-500 text-white rounded w-4 h-4 flex items-center justify-center">
                            <Check size={12} />
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-gray-900">Front mirror missing</div>
                            <div className="text-xs text-gray-500">Replace missing driver side mirror assembly • 01-001-001</div>
                        </div>
                    </div>
                </div>
             </div>
        </div>

        {/* Parts */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
             <h3 className="text-base font-bold text-gray-900 mb-6">Parts</h3>
             
             <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-500 uppercase mb-2 px-2">
                 <div className="col-span-5">Part Cost</div>
                 <div className="col-span-2">Quantity</div>
                 <div className="col-span-2">Cost</div>
                 <div className="col-span-2">Subtotal</div>
                 <div className="col-span-1"></div>
             </div>

             <div className="space-y-3">
                 {claimData.parts.filter(p => p.isCovered).map(part => (
                     <div key={part.id} className="grid grid-cols-12 gap-4 items-center">
                         <div className="col-span-5 flex items-center gap-3">
                             <div className="w-8 h-8 flex-shrink-0 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                                 <div className="w-3 h-3 bg-gray-400 rounded-sm"></div>
                             </div>
                             <div className="min-w-0">
                                 <div className="text-sm font-medium text-gray-900 truncate">{part.name}</div>
                                 <div className="text-xs text-gray-400 truncate">{part.sku}</div>
                             </div>
                         </div>
                         <div className="col-span-2">
                             <div className="relative">
                                <input type="text" className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm text-center" value={part.quantity} readOnly />
                                <span className="absolute right-2 top-2 text-[10px] text-gray-400">ea</span>
                             </div>
                         </div>
                         <div className="col-span-2">
                              <div className="relative">
                                <span className="absolute left-2 top-1.5 text-sm text-gray-500">$</span>
                                <input type="text" className="w-full border border-gray-300 rounded pl-5 pr-2 py-1.5 text-sm" value={part.unitPrice.toFixed(2)} readOnly />
                             </div>
                         </div>
                         <div className="col-span-2">
                             <div className="relative">
                                <span className="absolute left-2 top-1.5 text-sm text-gray-500">$</span>
                                <input type="text" className="w-full border border-gray-300 rounded pl-5 pr-2 py-1.5 text-sm bg-gray-50" readOnly value={(part.quantity * part.unitPrice).toFixed(2)} />
                             </div>
                         </div>
                         <div className="col-span-1 flex justify-end">
                             <button className="text-gray-400 hover:text-red-500"><Minus size={16} /></button>
                         </div>
                     </div>
                 ))}
                 
                 <button className="flex items-center gap-1 text-samsara-blue text-sm font-medium mt-2 hover:underline">
                     <Plus size={16} /> Add Part
                 </button>

                 <div className="flex justify-end pt-4 border-t border-gray-100">
                     <div className="flex items-center gap-4">
                         <span className="text-sm font-bold text-gray-700">Parts Total</span>
                         <div className="bg-gray-50 border border-gray-200 rounded px-3 py-1.5 text-sm font-semibold text-gray-900 min-w-[100px] text-right">
                             $ {claimData.parts.filter(p => p.isCovered).reduce((acc, p) => acc + (p.unitPrice * p.quantity), 0).toFixed(2)}
                         </div>
                     </div>
                 </div>
             </div>
        </div>

        {/* Labor */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
             <h3 className="text-base font-bold text-gray-900 mb-6">Labor</h3>
             
             <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-500 uppercase mb-2 px-2">
                 <div className="col-span-5">Technician / Task</div>
                 <div className="col-span-2">Hour</div>
                 <div className="col-span-2">Rate</div>
                 <div className="col-span-2">Subtotal</div>
                 <div className="col-span-1"></div>
             </div>

             <div className="space-y-3">
                 {claimData.labor.filter(l => l.isCovered).map(labor => (
                     <div key={labor.id} className="grid grid-cols-12 gap-4 items-center">
                         <div className="col-span-5 flex items-center gap-3">
                             <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-700 text-white flex items-center justify-center text-xs font-medium">
                                 {labor.technician.charAt(0)}
                             </div>
                             <div className="min-w-0">
                                 <div className="text-sm font-medium text-gray-900 truncate">{labor.technician}</div>
                                 <div className="text-xs text-gray-400 truncate">WO {claimData.workOrderId}</div>
                             </div>
                         </div>
                         <div className="col-span-2">
                             <div className="relative">
                                <input type="text" className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm text-center" value={labor.hours} readOnly />
                                <span className="absolute right-2 top-2 text-[10px] text-gray-400">hr</span>
                             </div>
                         </div>
                         <div className="col-span-2">
                              <div className="relative">
                                <span className="absolute left-2 top-1.5 text-sm text-gray-500">$</span>
                                <input type="text" className="w-full border border-gray-300 rounded pl-5 pr-2 py-1.5 text-sm" value={labor.rate} readOnly />
                             </div>
                         </div>
                         <div className="col-span-2">
                             <div className="relative">
                                <span className="absolute left-2 top-1.5 text-sm text-gray-500">$</span>
                                <input type="text" className="w-full border border-gray-300 rounded pl-5 pr-2 py-1.5 text-sm bg-gray-50" readOnly value={(labor.hours * labor.rate).toFixed(2)} />
                             </div>
                         </div>
                         <div className="col-span-1 flex justify-end">
                             <button className="text-gray-400 hover:text-red-500"><Minus size={16} /></button>
                         </div>
                     </div>
                 ))}
                 
                 <button className="flex items-center gap-1 text-samsara-blue text-sm font-medium mt-2 hover:underline">
                     <Plus size={16} /> Add labor
                 </button>

                 <div className="flex justify-end pt-4 border-t border-gray-100">
                     <div className="flex items-center gap-4">
                         <span className="text-sm font-bold text-gray-700">Labor Total</span>
                         <div className="bg-gray-50 border border-gray-200 rounded px-3 py-1.5 text-sm font-semibold text-gray-900 min-w-[100px] text-right">
                             $ {claimData.labor.filter(l => l.isCovered).reduce((acc, l) => acc + (l.rate * l.hours), 0).toFixed(2)}
                         </div>
                     </div>
                 </div>
             </div>
        </div>

        {/* Footer Totals */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-6">Total amount</h3>
            <div className="flex flex-col items-end gap-3">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-gray-900">Requested total</span>
                    <div className="bg-white border border-gray-300 rounded px-3 py-2 text-base font-semibold text-gray-900 min-w-[150px] flex justify-between">
                       <span>$</span> {claimData.totalAmount.toFixed(2)}
                    </div>
                </div>
                 <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-gray-900">Approved total</span>
                     <div className="bg-white border border-gray-300 rounded px-3 py-2 text-base font-semibold text-gray-900 min-w-[150px] flex justify-between">
                       <span>$</span>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};