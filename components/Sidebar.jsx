'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar({ role, menuItems, isOpen, onClose }) {
  const pathname = usePathname();

  const roleStyles = {
    admin: {
      bg: 'bg-slate-900',
      text: 'text-slate-700',
      active: 'bg-slate-100',
      hover: 'hover:bg-gray-100',
    },
    student: {
      bg: 'bg-blue-900',
      text: 'text-blue-700',
      active: 'bg-blue-100',
      hover: 'hover:bg-gray-100',
    },
    company: {
      bg: 'bg-emerald-900',
      text: 'text-emerald-700',
      active: 'bg-emerald-100',
      hover: 'hover:bg-gray-100',
    },
  };

  const styles = roleStyles[role] || roleStyles.student;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        bg-white border-r border-gray-200 min-h-screen p-6 flex flex-col
        w-64 fixed md:relative z-50 md:z-auto
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        md:translate-x-0
      `}>
        <div className="mb-8">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{role}</p>
          <h2 className={`text-base font-bold mt-2 capitalize ${styles.text}`}>{role} Portal</h2>
        </div>

      <nav className="space-y-1.5 flex-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-3 rounded-lg text-sm font-500 transition-smooth ${
                isActive
                  ? `${styles.bg} text-white shadow-md`
                  : `text-gray-700 ${styles.hover}`
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-gray-200 text-xs text-gray-500">
        <p>Portal v1.0</p>
      </div>
    </aside>
    </>
  );
}
