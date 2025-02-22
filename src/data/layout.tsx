import { Panel } from '@/types/layout.ts';
import React from 'react';
import { Database } from '@/pages/analysis/panels/database/database.tsx';
import { EngineLines } from '@/pages/analysis/panels/engineLines/engine-lines.tsx';
import { MoveList } from '@/pages/analysis/panels/moveList/move-list.tsx';
import { EvalHistory } from '@/pages/analysis/panels/evalHistory/eval-history.tsx';
import { Interpretation } from '@/pages/analysis/panels/interpretation/interpretation.tsx';

/**
 * A mapping of panel names to their corresponding icon identifiers.
 *
 * @type {Record<keyof typeof panels, string>}
 *
 * @property {string} database - Icon identifier for the database panel.
 * @property {string} engineLines - Icon identifier for the engine lines panel.
 * @property {string} moveList - Icon identifier for the move list panel.
 * @property {string} evalHistory - Icon identifier for the evaluation history panel.
 */
export const panelIcons: Record<keyof typeof panels, string> = {
  database: 'mdi:database',
  engineLines: 'game-icons:striking-arrows',
  moveList: 'ix:move',
  evalHistory: 'fa-solid:chart-line',
  interpretation: 'mdi:comment-quote',
};

/**
 * A record that maps panel names to their corresponding React components.
 *
 * @type {Record<Panel, React.ReactNode>}
 * @property {React.ReactNode} database - The component for the database panel.
 * @property {React.ReactNode} engineLines - The component for the engine lines panel.
 * @property {React.ReactNode} moveList - The component for the move list panel.
 * @property {React.ReactNode} evalHistory - The component for the evaluation history panel.
 */
export const panels: Record<Panel, React.ReactNode> = {
  database: <Database />,
  engineLines: <EngineLines />,
  moveList: <MoveList />,
  evalHistory: <EvalHistory />,
  interpretation: <Interpretation />,
};

export const panelTitles: Record<Panel, string> = {
  database: 'Database',
  engineLines: 'Engine Lines',
  moveList: 'Move List',
  evalHistory: 'Evaluation History',
  interpretation: 'Interpretation',
};
