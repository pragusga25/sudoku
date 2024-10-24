import SudokuGame from '@/components/sudoku-game';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="max-w-4xl mx-auto">
        <SudokuGame />
      </div>
    </main>
  );
}
