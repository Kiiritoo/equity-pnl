'use client';

import React from 'react';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onClose, confirmText = "Confirm", cancelText = "Cancel", isDestructive = false }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="dialog-container" onClick={e => e.stopPropagation()}>
                <h3 className="dialog-title">
                    {title}
                </h3>
                <p className="dialog-message">
                    {message}
                </p>
                <div className="dialog-actions">
                    <button
                        className="dialog-btn dialog-btn-cancel"
                        onClick={onClose}
                    >
                        {cancelText}
                    </button>
                    <button
                        className={`dialog-btn ${isDestructive ? 'dialog-btn-destructive' : 'dialog-btn-confirm'}`}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
