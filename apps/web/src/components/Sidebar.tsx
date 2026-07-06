import React from "react";
import { NAV_GROUPS, PageKey } from "../nav";

export function Sidebar({ page, onNavigate }: { page: PageKey; onNavigate: (p: PageKey) => void }) {
  return (
    <div className="sidebar">
      <div className="sidebar-brand">사내 업무 포탈</div>
      <div className="sidebar-scroll">
        {NAV_GROUPS.map((group) => (
          <div key={group.key} className="sidebar-group">
            <div className="sidebar-group-label">{group.icon} {group.label}</div>
            {group.items.map((item) => (
              <button
                key={item.key}
                className={"sidebar-item" + (page === item.key ? " active" : "")}
                onClick={() => onNavigate(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </div>
      <a className="badge" href="/api/docs" target="_blank" style={{ margin: 12 }}>API Swagger</a>
    </div>
  );
}
