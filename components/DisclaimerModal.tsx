import React from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { DISCLAIMER_TEXT, APP_NAME } from '../constants';

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
        <div className="bg-teal-50 p-6 border-b border-teal-100 flex items-center gap-4">
          <div className="p-3 bg-white rounded-full shadow-sm text-teal-600">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 font-serif">{APP_NAME}</h2>
            <p className="text-xs text-teal-600 font-medium uppercase tracking-wide">Important Disclaimer</p>
          </div>
        </div>
        <div className="p-6">
          <p className="text-slate-600 text-sm leading-relaxed">
            {DISCLAIMER_TEXT}
          </p>
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg shadow-lg shadow-teal-600/20 transition-all active:scale-95 flex items-center gap-2"
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerModal;
