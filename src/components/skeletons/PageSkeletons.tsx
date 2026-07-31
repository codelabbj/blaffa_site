'use client';

import type { CSSProperties } from 'react';

type ShimmerProps = {
  className?: string;
  delay?: number;
};

export function ShimmerBone({ className = '', delay = 0 }: ShimmerProps) {
  return (
    <div
      className={`skeleton-shimmer ${className}`}
      style={{ '--shimmer-delay': `${delay}s` } as CSSProperties}
    />
  );
}

export function PageSpinner({ label = 'Chargement...' }: { label?: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
      <ShimmerBone className="h-10 w-10 rounded-full" />
      <ShimmerBone className="h-4 w-28 rounded-md" delay={0.1} />
      <p className="sr-only">{label}</p>
    </div>
  );
}

export function TransactionRowsSkeleton({ count = 4, className = '' }: { count?: number; className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-1 py-2">
          <ShimmerBone className="h-11 w-11 shrink-0 rounded-full" delay={i * 0.07} />
          <div className="min-w-0 flex-1 space-y-2">
            <ShimmerBone className="h-4 w-3/5 max-w-[180px] rounded-md" delay={i * 0.07 + 0.05} />
            <ShimmerBone className="h-3 w-2/5 max-w-[120px] rounded-md" delay={i * 0.07 + 0.1} />
          </div>
          <ShimmerBone className="h-5 w-16 shrink-0 rounded-md" delay={i * 0.07 + 0.08} />
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-4 px-6 pt-6">
      <ShimmerBone className="h-8 w-40 rounded-lg" />
      <ShimmerBone className="h-28 w-full rounded-2xl" delay={0.05} />
      <div className="grid grid-cols-2 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <ShimmerBone key={i} className="h-24 rounded-2xl" delay={i * 0.08} />
        ))}
      </div>
      <ShimmerBone className="h-6 w-32 rounded-md" delay={0.1} />
      <TransactionRowsSkeleton count={3} />
    </div>
  );
}

export function HistoricListSkeleton() {
  return (
    <div className="space-y-4 px-6 pt-6">
      <div className="flex items-center justify-between">
        <ShimmerBone className="h-8 w-36 rounded-lg" />
        <ShimmerBone className="h-9 w-9 rounded-full" delay={0.05} />
      </div>
      <ShimmerBone className="h-10 w-full rounded-xl" delay={0.08} />
      <TransactionRowsSkeleton count={5} />
    </div>
  );
}

export function NotificationsSkeleton() {
  return (
    <div className="space-y-4 px-4 pt-6">
      <ShimmerBone className="h-8 w-40 rounded-lg" />
      {[0, 1, 2].map((i) => (
        <div key={i} className="space-y-3 rounded-2xl p-1">
          <ShimmerBone className="h-5 w-2/5 max-w-[160px] rounded-md" delay={i * 0.1} />
          <ShimmerBone className="h-4 w-full rounded-md" delay={i * 0.1 + 0.05} />
          <ShimmerBone className="h-4 w-4/5 rounded-md" delay={i * 0.1 + 0.1} />
          <ShimmerBone className="h-3 w-24 rounded-md" delay={i * 0.1 + 0.15} />
        </div>
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-4 pb-8">
      <ShimmerBone className="mx-auto mt-12 h-24 w-24 rounded-full" />
      <ShimmerBone className="mx-auto h-5 w-48 rounded-md" delay={0.08} />
      <ShimmerBone className="mx-6 h-40 rounded-2xl" delay={0.12} />
      <ShimmerBone className="mx-6 h-14 rounded-2xl" delay={0.16} />
      <ShimmerBone className="mx-6 h-14 rounded-2xl" delay={0.2} />
    </div>
  );
}

export function DepositPageSkeleton() {
  return (
    <div className="space-y-4 px-4 pt-6">
      <ShimmerBone className="h-10 w-full rounded-xl" />
      <ShimmerBone className="h-32 w-full rounded-2xl" delay={0.06} />
      <ShimmerBone className="h-48 w-full rounded-2xl" delay={0.1} />
      <ShimmerBone className="h-12 w-full rounded-xl" delay={0.14} />
    </div>
  );
}

export function WithdrawPageSkeleton() {
  return <DepositPageSkeleton />;
}
