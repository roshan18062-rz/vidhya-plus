import React from 'react';

// Skeleton card for loading states
export function CardSkeleton({ lines = 3 }) {
  return (
    <div className="card-3d" style={{ padding: '1.5rem' }}>
      <div className="skeleton" style={{ width: '40%', height: '14px', marginBottom: '1rem' }} />
      <div className="skeleton" style={{ width: '70%', height: '28px', marginBottom: '1rem' }} />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton" style={{ width: `${60 + Math.random() * 30}%`, height: '12px', marginBottom: '0.5rem' }} />
      ))}
    </div>
  );
}

// Skeleton row for tables
export function TableRowSkeleton({ cols = 6 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i}>
          <div className="skeleton" style={{ height: '14px', width: `${50 + Math.random() * 40}%` }} />
        </td>
      ))}
    </tr>
  );
}

// Skeleton for dashboard grid
export function DashboardSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
      {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} lines={3} />)}
    </div>
  );
}