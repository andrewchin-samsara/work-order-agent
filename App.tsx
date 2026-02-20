import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { WorkOrderView } from './components/WorkOrderView';
import { WarrantyAgentPanel } from './components/WarrantyAgentPanel';
import { ClaimDraftView } from './components/ClaimDraftView';
import { MOCK_WORK_ORDER } from './constants';
import { WarrantyDraft, ClaimData, ClaimPart, ClaimLabor } from './types';
import { Search, Bell, Grid, Loader2 } from 'lucide-react';
import { generateWarrantyDraft } from './services/geminiService';

type ViewState = 'workOrder' | 'claimDraft';

export default function App() {
  const [isAgentOpen, setIsAgentOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('workOrder');
  const [claimDraftData, setClaimDraftData] = useState<ClaimData | null>(null);
  const [initialDraft, setInitialDraft] = useState<WarrantyDraft | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createClaimFromDraft = (draft: WarrantyDraft) => {
    // Transform WorkOrder + WarrantyDraft -> ClaimData
    const allParts: ClaimPart[] = [];
    const allLabor: ClaimLabor[] = [];

    MOCK_WORK_ORDER.tasks.forEach(task => {
        task.parts.forEach(part => {
            allParts.push({
                ...part,
                isCovered: draft.coveredItems.includes(part.id)
            });
        });
        task.labor.forEach(labor => {
            allLabor.push({
                ...labor,
                isCovered: draft.coveredItems.includes(labor.id)
            });
        });
    });

    return {
        workOrderId: MOCK_WORK_ORDER.id,
        vehicleName: MOCK_WORK_ORDER.vehicleName,
        vehicleId: MOCK_WORK_ORDER.vehicleId,
        odometer: 3215,
        engineHours: 1121,
        createdDate: 'April 01, 2025',
        createdBy: 'Jake Carni',
        failureDate: '04/01/2024',
        repairDate: '04/01/2024',
        threeCs: draft.threeCs,
        parts: allParts,
        labor: allLabor,
        totalAmount: draft.totalClaimable
    };
  };

  const handleCreateDraft = (draft: WarrantyDraft) => {
    const newClaimData = createClaimFromDraft(draft);
    setClaimDraftData(newClaimData);
    setCurrentView('claimDraft');
  };

  const handleDraftWarrantyWithAI = async () => {
      setIsLoading(true);
      try {
          // Generate the draft
          const draft = await generateWarrantyDraft(MOCK_WORK_ORDER);
          
          // Create claim data
          const newClaimData = createClaimFromDraft(draft);
          
          setClaimDraftData(newClaimData);
          setInitialDraft(draft);
          setCurrentView('claimDraft');
          setIsAgentOpen(true);
      } catch (error) {
          console.error("Failed to generate draft", error);
          // Optional: Show error toast
      } finally {
          setIsLoading(false);
      }
  };

  const handleBackToWorkOrder = () => {
      setCurrentView('workOrder');
      setInitialDraft(null);
  };

  const handleUpdateClaim = (updatedClaim: ClaimData) => {
      setClaimDraftData(updatedClaim);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Global Top Nav */}
        <div className="bg-white h-14 border-b border-gray-200 flex items-center justify-between px-4 flex-shrink-0 z-10">
           <div className="flex items-center bg-gray-100 rounded px-3 py-1.5 w-64">
              <Search size={16} className="text-gray-500 mr-2" />
              <input type="text" placeholder="Search" className="bg-transparent border-none outline-none text-sm w-full" />
              <span className="text-gray-400 text-xs border border-gray-300 rounded px-1">⌘K</span>
           </div>
           
           <div className="flex items-center gap-4 text-gray-500">
               <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                   0
               </div>
               <Bell size={20} className="hover:text-gray-700 cursor-pointer" />
               <Grid size={20} className="hover:text-gray-700 cursor-pointer" />
               <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                   <img src="https://picsum.photos/100/100" alt="Profile" className="w-full h-full object-cover" />
               </div>
           </div>
        </div>

        <div className="flex-1 flex overflow-hidden relative">
            {isLoading && (
                <div className="absolute inset-0 bg-white/80 z-50 flex items-center justify-center backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                        <p className="text-sm font-medium text-gray-600">Generating warranty draft...</p>
                    </div>
                </div>
            )}

            {currentView === 'workOrder' ? (
                <WorkOrderView 
                    workOrder={MOCK_WORK_ORDER} 
                    onOpenAgent={() => setIsAgentOpen(true)}
                    onDraftWarranty={handleDraftWarrantyWithAI}
                />
            ) : (
                claimDraftData && (
                    <ClaimDraftView 
                        claimData={claimDraftData}
                        onBack={handleBackToWorkOrder}
                        onOpenAgent={() => setIsAgentOpen(true)}
                    />
                )
            )}
            
            <WarrantyAgentPanel 
                isOpen={isAgentOpen} 
                onClose={() => setIsAgentOpen(false)}
                workOrder={MOCK_WORK_ORDER}
                onCreateDraft={handleCreateDraft}
                isDraftMode={currentView === 'claimDraft'}
                currentClaim={claimDraftData}
                onUpdateClaim={handleUpdateClaim}
                initialDraft={initialDraft}
            />
        </div>
      </div>
    </div>
  );
}