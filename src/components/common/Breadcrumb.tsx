import React from 'react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav 
      className={`breadcrumb-nav ${className}`} 
      aria-label="Breadcrumb"
      style={{
        padding: '12px 0',
        borderBottom: '1px solid #e9ecef',
        backgroundColor: '#f8f9fa'
      }}
    >
      <ol className="breadcrumb d-flex align-items-center gap_8 mb-0">
        {items.map((item, index) => (
          <li key={index} className="breadcrumb-item d-flex align-items-center">
            {index > 0 && (
              <i className="icon-CaretRight text-muted me-2" style={{ fontSize: '12px' }}></i>
            )}
            {item.href && index < items.length - 1 ? (
              <Link 
                href={item.href} 
                className="text-decoration-none text-muted"
                style={{ fontSize: '14px' }}
              >
                {item.label}
              </Link>
            ) : (
              <span 
                className={index === items.length - 1 ? 'text-primary fw-medium' : 'text-muted'}
                style={{ fontSize: '14px' }}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}