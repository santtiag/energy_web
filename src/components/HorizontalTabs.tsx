'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './HorizontalTabs.module.css';

interface Tab {
  label: string;
  path: string;
}

interface HorizontalTabsProps {
  tabs: Tab[];
  basePath: string;
}

export default function HorizontalTabs({ tabs, basePath }: HorizontalTabsProps) {
  const pathname = usePathname();
  const activeTab = pathname;

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabsWrapper}>
        {tabs.map((tab) => (
          <Link
            key={tab.path}
            href={tab.path}
            className={`${styles.tab} ${activeTab === tab.path ? styles.active : ''}`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
      <div className={styles.tabUnderline} />
    </div>
  );
}
