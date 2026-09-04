import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar, TabType } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { LandingPage } from './views/LandingPage';
import { DashboardView } from './views/DashboardView';
import { ReconciliationLabView } from './views/ReconciliationLabView';
import { EvidenceIntelligenceView } from './views/EvidenceIntelligenceView';
import { ExceptionsView } from './views/ExceptionsView';
import { AnalyticsView } from './views/AnalyticsView';
import { AuditTrailView } from './views/AuditTrailView';
import { DemoModeView } from './views/DemoModeView';
import { SettingsView } from './views/SettingsView';
import { AnalysisAnimationModal } from './components/common/AnalysisAnimationModal';
import { apiClient } from './services/api';
import { BatchAnalysisSummary, ReconciliationResult } from './types';

export function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('landing');
  const [summary, setSummary] = useState<BatchAnalysisSummary | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<ReconciliationResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  // Load initial summary
  useEffect(() => {
    apiClient.getSummary().then(data => {
      setSummary(data);
      if (data.records.length > 0) {
        setSelectedRecord(data.records.find(r => r.txn_id === 'TXN-1025') || data.records[0]);
      }
    });
  }, []);

  const handleRunReconciliation = async () => {
    setShowAnalysisModal(true);
    setIsAnalyzing(true);
    try {
      const data = await apiClient.runReconciliation();
      setSummary(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalysisComplete = () => {
    setShowAnalysisModal(false);
    if (currentTab === 'landing') {
      setCurrentTab('dashboard');
    }
  };

  const handleGenerateDataset = async (count: number, difficulty: string) => {
    setIsAnalyzing(true);
    try {
      const data = await apiClient.generateDataset(count, difficulty);
      setSummary(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsAnalyzing(true);
    try {
      const data = await apiClient.uploadFile(file);
      setSummary(data);
      setShowAnalysisModal(true);
    } catch (e) {
      alert(`Upload error: ${(e as Error).message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectRecord = (record: ReconciliationResult) => {
    setSelectedRecord(record);
    setCurrentTab('evidence');
  };

  const handleResolveRecord = async (recordId: string, action: string, notes?: string, newUtr?: string) => {
    await apiClient.resolveRecord(recordId, action, notes, newUtr);
    const updatedSummary = await apiClient.getSummary();
    setSummary(updatedSummary);
    if (selectedRecord && (selectedRecord.record_id === recordId || selectedRecord.txn_id === recordId)) {
      const updated = updatedSummary.records.find(r => r.record_id === recordId || r.txn_id === recordId);
      if (updated) setSelectedRecord(updated);
    }
  };

  if (!summary) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mb-4" />
        <span className="text-sm font-semibold tracking-wide text-slate-300">
          Initializing ProofGap AI Engine...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        exceptionCount={summary.exception_count}
        reviewCount={summary.review_count}
      />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Sticky Header */}
        <Navbar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onRunReconciliation={handleRunReconciliation}
          onReloadDataset={() => handleGenerateDataset(250, 'medium')}
          isAnalyzing={isAnalyzing}
          totalRecords={summary.total_records}
          safetyScore={summary.automation_safety_score}
        />

        {/* Page Content Body */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {currentTab === 'landing' && (
                <LandingPage onNavigate={setCurrentTab} />
              )}

              {currentTab === 'dashboard' && (
                <DashboardView
                  summary={summary}
                  onRunReconciliation={handleRunReconciliation}
                  onNavigate={setCurrentTab}
                  isAnalyzing={isAnalyzing}
                />
              )}

              {currentTab === 'reconciliation' && (
                <ReconciliationLabView
                  summary={summary}
                  onRunReconciliation={handleRunReconciliation}
                  onGenerateDataset={handleGenerateDataset}
                  onFileUpload={handleFileUpload}
                  onSelectRecord={handleSelectRecord}
                  isAnalyzing={isAnalyzing}
                />
              )}

              {currentTab === 'evidence' && (
                <EvidenceIntelligenceView
                  summary={summary}
                  selectedRecord={selectedRecord}
                  onSelectRecord={handleSelectRecord}
                  onResolveRecord={handleResolveRecord}
                />
              )}

              {currentTab === 'exceptions' && (
                <ExceptionsView
                  summary={summary}
                  onSelectRecord={handleSelectRecord}
                  onResolveRecord={handleResolveRecord}
                />
              )}

              {currentTab === 'analytics' && (
                <AnalyticsView summary={summary} />
              )}

              {currentTab === 'audit' && (
                <AuditTrailView summary={summary} />
              )}

              {currentTab === 'demo' && (
                <DemoModeView />
              )}

              {currentTab === 'settings' && (
                <SettingsView />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Reconciliation Pipeline Animation Overlay */}
      <AnalysisAnimationModal
        isOpen={showAnalysisModal}
        onComplete={handleAnalysisComplete}
        recordCount={summary.total_records}
      />
    </div>
  );
}

export default App;
