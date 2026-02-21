'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const WithdrawalModal = ({ isOpen, onClose, onAdd, onEdit, initialData }) => {
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setAmount(initialData.amount.toString());
            setDate(new Date(initialData.date).toISOString().split('T')[0]);
            setNote(initialData.note || '');
        } else {
            setAmount('');
            setDate(new Date().toISOString().split('T')[0]);
            setNote('');
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        let success;
        if (initialData) {
            success = await onEdit({
                id: initialData.id,
                amount: parseFloat(amount),
                date: new Date(date).toISOString(),
                note
            });
        } else {
            success = await onAdd({
                amount: parseFloat(amount),
                date: new Date(date).toISOString(),
                note
            });
        }

        setLoading(false);
        if (success) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="dialog-container" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="dialog-title">{initialData ? 'Edit Withdrawal' : 'Add Withdrawal'}</h2>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="form-group" style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Amount</label>
                        <input
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            required
                            autoFocus
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                color: 'var(--text-primary)',
                                fontSize: '16px'
                            }}
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                color: 'var(--text-primary)',
                                fontSize: '16px'
                            }}
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Note (Optional)</label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Reason for withdrawal..."
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                color: 'var(--text-primary)',
                                fontSize: '16px',
                                minHeight: '80px',
                                resize: 'vertical'
                            }}
                        />
                    </div>
                    <div className="dialog-actions">
                        <button type="button" className="dialog-btn dialog-btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="dialog-btn dialog-btn-confirm" disabled={loading}>
                            {loading ? 'Saving...' : (initialData ? 'Update' : 'Add Withdrawal')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WithdrawalModal;
