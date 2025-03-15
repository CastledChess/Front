import { TutorialStep, useAuthStore } from '@/store/auth.ts';

const { setTutorialStep } = useAuthStore.getState();

export const dashboardSteps = [
  {
    selector: '.dashboard-table',
    content:
      'Welcome to Castled! This is the game history table. Where you can view and manage every analysis you have made.',
  },
  {
    selector: '.start-analysis',
    content: 'Let\'s analyze a game! Click on the "New Analysis" button to start a new analysis.',
    actionAfter: () => setTutorialStep(TutorialStep.START_ANALYSIS),
  },
];

export const startAnalysisSteps = [
  {
    selector: '.tutorial-import',
    content: 'Import a game from chess.com, lichess.org or simply copy and pase a PGN into the text area below.',
  },
  {
    selector: '.tutorial-engine',
    content: 'Select an engine to analyze the game',
  },
  {
    selector: '.tutorial-engine-dl',
    content: 'Once you selected an engine, you need to download it, large engines may take some time to download.',
  },
  {
    selector: '.tutorial-go',
    content: 'Click "Go" to start the analysis',
    actionAfter: () => setTutorialStep(TutorialStep.ANALYSIS),
  },
];

export const analysisSteps = [
  {
    selector: '.tutorial-chessboard',
    content: 'This is the chessboard (duh).',
  },
  {
    selector: '.tutorial-chessboard-controls',
    content: 'You can walk through the moves played during the game using these controls.',
  },
  {
    selector: '.tutorial-chessboard-eval',
    content: 'This is the evaluation bar. It shows the engine evaluation of the current position.',
  },
  {
    selector: '.tutorial-database',
    content:
      'This is the database panel. It displays the ratio of Win/Draw/Loss for each move in the current position based on ~1.5 million games. Hovering over a move will display an arrow on the chessboard to help you visualize it.',
  },
  {
    selector: '.tutorial-eval-history',
    content: 'This is the evaluation history panel. It displays the evolution of the engine evaluation over time.',
  },
  {
    selector: '.tutorial-move-list',
    content:
      'This is the move list panel. It displays the moves played during the game. You can click on a move to jump to that position.',
  },
  {
    selector: '.tutorial-interpretation',
    content:
      'Finally, this is the interpretation panel. It displays additional information about the current position that might be useful for beginners.',
    actionAfter: () => setTutorialStep(TutorialStep.DONE),
  },
];
