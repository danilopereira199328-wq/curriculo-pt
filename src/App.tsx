import { CVForm } from './components/CVForm';
import { CVPreview } from './components/CVPreview';
import { DownloadButtons } from './components/DownloadButtons';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>📄 Currículo.pt</h1>
        <p>Cria o teu currículo profissional em minutos</p>
      </header>

      <main className="app-main">
        <div className="app-sidebar">
          <CVForm />
          <DownloadButtons />
        </div>
        <div className="app-preview">
          <CVPreview />
        </div>
      </main>
    </div>
  );
}

export default App;