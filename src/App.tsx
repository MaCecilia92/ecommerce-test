import { Routes, Route } from 'react-router-dom';
import { Header } from '@/components';
import Footer from '@/components/Footer';
import { Home, ProductDetail } from '@/pages';

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
