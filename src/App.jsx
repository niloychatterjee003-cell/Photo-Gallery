import Gallery from './components/Gallery';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 py-5 shadow-xs">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Photo Gallery
        </h1>
      </header>
      <main>
        <Gallery />
      </main>
    </div>
  );
}

export default App;