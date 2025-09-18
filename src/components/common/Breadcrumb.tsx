"use client";

import React from 'react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
  isHome?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  // DEBUG: Show timestamp to verify we're seeing current version
  console.log('🔗 BREADCRUMB RENDER:', new Date().toISOString(), items);
  
  return (
    <nav 
      className={`breadcrumb-nav ${className}`} 
      aria-label="Breadcrumb"
      style={{
        padding: '20px 0',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        marginBottom: '0'
      }}
    >
      <div className="d-flex align-items-center flex-wrap">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {/* Home icon for first item */}
            {index === 0 && item.isHome && (
              <div className="d-flex align-items-center">
                {item.href ? (
                  <Link 
                    href={item.href} 
                    className="text-decoration-none d-flex align-items-center breadcrumb-home-link"
                    style={{ 
                      color: '#6b7280',
                      fontSize: '16px',
                      transition: 'all 0.2s ease',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      backgroundColor: '#f9fafb'
                    }}
                  >
                    <i className="icon-House" style={{ fontSize: '20px' }}></i>
                  </Link>
                ) : (
                  <div style={{ 
                    padding: '8px 12px',
                    borderRadius: '6px',
                    backgroundColor: '#f9fafb'
                  }}>
                    <i className="icon-House" style={{ fontSize: '20px', color: '#6b7280' }}></i>
                  </div>
                )}
              </div>
            )}
            
            {/* Non-home items */}
            {(!item.isHome || index > 0) && (
              <div className="d-flex align-items-center">
                {item.href && index < items.length - 1 ? (
                  <Link 
                    href={item.href} 
                    className="text-decoration-none breadcrumb-link"
                    style={{ 
                      fontSize: '15px',
                      color: '#4b5563',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      backgroundColor: 'transparent',
                      textDecoration: 'none'
                    }}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span 
                    className={index === items.length - 1 ? 'breadcrumb-current' : 'breadcrumb-item'}
                    style={{ 
                      fontSize: '15px',
                      color: index === items.length - 1 ? '#1f2937' : '#6b7280',
                      fontWeight: index === items.length - 1 ? '600' : '500',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      backgroundColor: index === items.length - 1 ? '#f3f4f6' : 'transparent'
                    }}
                  >
                    {item.label}
                  </span>
                )}
              </div>
            )}
            
            {/* Separator arrow */}
            {index < items.length - 1 && (
              <i 
                className="icon-CaretRight mx-3" 
                style={{ 
                  fontSize: '14px', 
                  color: '#d1d5db',
                  fontWeight: 'bold'
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      <style jsx>{`
        .breadcrumb-home-link:hover {
          color: #2563eb !important;
          background-color: #e0e7ff !important;
          transform: translateY(-1px);
        }
        .breadcrumb-link:hover {
          color: #2563eb !important;
          background-color: #f1f5f9 !important;
          transform: translateY(-1px);
        }
        .breadcrumb-nav {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border-bottom: 1px solid #e2e8f0;
        }
        .breadcrumb-current {
          font-weight: 600 !important;
          color: #1e293b !important;
        }
        .mx-3 {
          margin-left: 12px !important;
          margin-right: 12px !important;
        }
      `}</style>
    </nav>
  );
}