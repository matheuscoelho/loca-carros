'use client'

import { CSSProperties } from 'react'

interface SkeletonProps {
  width?: string | number
  height?: string | number
  borderRadius?: string | number
  className?: string
  style?: CSSProperties
}

// Base Skeleton Component
export function Skeleton({
  width = '100%',
  height = '20px',
  borderRadius = '4px',
  className = '',
  style = {}
}: SkeletonProps) {
  return (
    <div
      className={`skeleton-pulse ${className}`}
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-loading 1.5s ease-in-out infinite',
        ...style
      }}
    />
  )
}

// Skeleton for Car Cards
export function SkeletonCard() {
  return (
    <div className="skeleton-card border rounded-3 overflow-hidden">
      {/* Image */}
      <Skeleton height="200px" borderRadius="0" />

      {/* Content */}
      <div className="p-3">
        {/* Rating */}
        <div className="d-flex align-items-center gap-2 mb-2">
          <Skeleton width="60px" height="16px" />
          <Skeleton width="40px" height="16px" />
        </div>

        {/* Title */}
        <Skeleton width="80%" height="24px" className="mb-2" />

        {/* Location */}
        <Skeleton width="60%" height="16px" className="mb-3" />

        {/* Specs */}
        <div className="d-flex gap-2 mb-3">
          <Skeleton width="60px" height="20px" borderRadius="12px" />
          <Skeleton width="60px" height="20px" borderRadius="12px" />
          <Skeleton width="60px" height="20px" borderRadius="12px" />
        </div>

        {/* Price and Button */}
        <div className="d-flex justify-content-between align-items-center">
          <Skeleton width="80px" height="28px" />
          <Skeleton width="100px" height="36px" borderRadius="8px" />
        </div>
      </div>

      <style jsx>{`
        .skeleton-card {
          background: #fff;
        }
      `}</style>
    </div>
  )
}

// Skeleton for Table Rows
export function SkeletonTableRow({ columns = 5 }: { columns?: number }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="py-3">
          <Skeleton
            width={index === 0 ? '80%' : index === columns - 1 ? '60px' : '70%'}
            height="20px"
          />
        </td>
      ))}
    </tr>
  )
}

// Skeleton for Stats Cards
export function SkeletonStatCard() {
  return (
    <div className="border rounded-3 p-4">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <Skeleton width="50px" height="50px" borderRadius="12px" />
        <Skeleton width="60px" height="24px" borderRadius="12px" />
      </div>
      <Skeleton width="40%" height="16px" className="mb-2" />
      <Skeleton width="60%" height="32px" />
    </div>
  )
}

// Skeleton for Dashboard Stats Grid
export function SkeletonDashboardStats() {
  return (
    <div className="row g-4 mb-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="col-md-6 col-xl-3">
          <SkeletonStatCard />
        </div>
      ))}
    </div>
  )
}

// Skeleton for Car Cards Grid
export function SkeletonCardsGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="row g-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="col-md-6 col-lg-4">
          <SkeletonCard />
        </div>
      ))}
    </div>
  )
}

// Skeleton for Table
export function SkeletonTable({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            {Array.from({ length: columns }).map((_, index) => (
              <th key={index}>
                <Skeleton width="80%" height="16px" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, index) => (
            <SkeletonTableRow key={index} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Skeleton for Booking Summary
export function SkeletonBookingSummary() {
  return (
    <div className="border rounded-3 p-4">
      {/* Image */}
      <Skeleton height="150px" className="mb-3" borderRadius="8px" />

      {/* Title */}
      <Skeleton width="80%" height="24px" className="mb-2" />
      <Skeleton width="60%" height="16px" className="mb-4" />

      {/* Details */}
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="d-flex justify-content-between mb-2">
          <Skeleton width="40%" height="16px" />
          <Skeleton width="30%" height="16px" />
        </div>
      ))}

      <hr />

      {/* Total */}
      <div className="d-flex justify-content-between">
        <Skeleton width="30%" height="24px" />
        <Skeleton width="40%" height="28px" />
      </div>
    </div>
  )
}

// Global Skeleton Styles (add to your global CSS or as a style tag)
export function SkeletonStyles() {
  return (
    <style jsx global>{`
      @keyframes skeleton-loading {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }

      .skeleton-pulse {
        position: relative;
        overflow: hidden;
      }
    `}</style>
  )
}

export default Skeleton
