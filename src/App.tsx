/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Header from './components/Header';
import Hero from './components/Hero';
import Manifesto from './components/Manifesto';
import SocialLinks from './components/SocialLinks';
import Footer from './components/Footer';

export default function App() {
  return (
    <main className="relative min-h-screen selection:bg-text-bone selection:text-bg-deep">
      {/* Texture Layer */}
      <div className="grain" />
      
      {/* Grid Layout Container */}
      <div className="grid-layout flex flex-col">
        <Header />
        <div className="flex-grow">
          <Hero />
          <Manifesto />
          <SocialLinks />
        </div>
        <Footer />
      </div>
    </main>
  );
}
