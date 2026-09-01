#!/usr/bin/env python3
"""Generate report.html"""
import os

html = r"""<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Report a Found Item &#8212; EagleCatch</title>
    <meta name="description" content="Report a found item to the EagleCatch lost and found desk at ASKI." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="assets/css/styles.css?v=3" />
  </head>
  <body>
    <header class="site-header">
      <div class="container">
        <a class="brand" href="index.html">
          <span class="brand-mark"><img src="assets/images/eaglecatch-logo.png" alt="EagleCatch Logo" /></span>
          <span><span class="brand-name">EagleCatch</span><br /><span class="brand-sub">ASKI Lost &amp; Found</span></span>
        </a>
        <nav class="nav" id="nav">
          <a href="index.html">Home</a><a href="find.html">Find</a><a href="about.html">About</a><a href="contact.html">Contact</a>
        </nav>
        <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        </button>
      </div>
    </header>
    <main>
      <section class="hero hero-split">
        <div class="hero-blob hero-blob-1"><svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path class="blob-fill-1" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90,-16.3,88.5,-0.9C87,14.5,81.4,29,72.7,41.1C64,53.2,52.2,62.9,39.3,70.1C26.4,77.3,12.4,82,-1.5,84.5C-15.4,87,-30.8,87.3,-44.1,81C-57.4,74.7,-68.6,61.8,-76.2,47.2C-83.8,32.6,-87.8,16.3,-87.8,0C-87.8,-16.3,-83.8,-32.6,-75.4,-46C-67,-59.4,-54.2,-69.9,-40.3,-77.2C-26.4,-84.5,-11.4,-88.7,2.1,-92.6C15.6,-96.5,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" /></svg></div>
        <div class="hero-blob hero-blob-2"><svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path class="blob-fill-2" d="M39.9,-65.7C54.1,-60.5,69.5,-53.4,77.7,-41.6C85.9,-29.8,86.9,-13.3,84.1,2.1C81.3,17.5,74.7,31.8,65.5,43.7C56.3,55.6,44.5,65.1,31.1,71.7C17.7,78.3,2.7,82,-12.1,81.5C-26.9,81,-41.5,76.3,-54.1,68.1C-66.7,59.9,-77.3,48.2,-82.4,34.3C-87.5,20.4,-87.1,4.3,-83.7,-10.6C-80.3,-25.5,-73.9,-39.2,-63.8,-49.7C-53.7,-60.2,-39.9,-67.5,-26.3,-73.1C-12.7,-78.7,0.7,-82.6,14,-81.1C27.3,-79.6,25.7,-52.1,39.9,-65.7Z" transform="translate(100 100)" /></svg></div>
        <div class="container hero-split-grid">
          <div class="hero-content">
            <span class="eyebrow">Found something?</span>
            <h1>Report a <span class="text-gradient-brand">found item</span></h1>
            <p class="lead">Help return a lost item to its owner. Fill out the details below and the EagleCatch team will log it immediately.</p>
          </div>
          <div class="hero-visual">
            <div class="hero-logo-blob">
              <svg class="blob-outline" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg"><path class="blob-stroke" fill="none" stroke-width="2" d="M150,30 C190,25 230,50 255,90 C280,130 275,180 255,220 C235,260 195,285 150,280 C105,275 65,255 40,215 C15,175 20,130 40,90 C60,50 110,35 150,30Z" /></svg>
              <div class="hero-logo-circle"><img src="assets/images/logo.png" alt="ASKI Logo" /></div>
            </div>
          </div>
        </div>
      </section>

      <section class="section container narrow">
        <form class="card form-grid" id="reportForm">
          <h3>Item details</h3>
          <p class="text-muted" style="margin-bottom:0.5rem">Fields marked with * are required.</p>
          <div class="grid grid-2">
            <div class="field"><label for="itemName">Item name *</label><input class="input" id="itemName" placeholder="e.g. Blue Hydro Flask, Black Casio watch..." required /></div>
            <div class="field"><label for="itemCategory">Category *</label>
              <select class="select" id="itemCategory" required>
                <option value="">Select a category</option>
                <option>Accessories</option><option>Bottles</option><option>Clothing</option><option>Electronics</option><option>School Supplies</option><option>Other</option>
              </select>
            </div>
          </div>
          <div class="field"><label for="itemDescription">Description *</label><textarea class="textarea" id="itemDescription" placeholder="Describe the item: color, brand, distinguishing marks, condition..." required></textarea></div>
          <div class="grid grid-2">
            <div class="field"><label for="itemLocation">Location found *</label><input class="input" id="itemLocation" placeholder="e.g. School Canteen, Room 12-B, Covered Court..." required /></div>
            <div class="field"><label for="itemDate">Date found *</label><input class="input" id="itemDate" type="date" required /></div>
          </div>
          <hr style="border:none;border-top:1px dashed color-mix(in oklab, var(--border) 80%, transparent);margin:0.5rem 0" />
          <h3>Your information</h3>
          <div class="grid grid-2">
            <div class="field"><label for="reporterName">Your name *</label><input class="input" id="reporterName" placeholder="Full name" required /></div>
            <div class="field"><label for="reporterEmail">Your email *</label><input class="input" id="reporterEmail" type="email" placeholder="you@example.com" required /></div>
          </div>
          <div class="field"><label for="reporterNotes">Additional notes</label><textarea class="textarea" id="reporterNotes" placeholder="Anything else the team should know? (optional)" style="min-height:5rem"></textarea></div>
          <button class="btn btn-primary btn-lg" type="submit">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            Submit report
          </button>
          <p class="text-muted" id="formStatus" hidden></p>
        </form>

        <div class="card mt-8" style="text-align:left">
          <h3>What happens next?</h3>
          <div class="stack mt-8">
            <div class="people">
              <div class="avatar" style="background:var(--gold);color:oklch(0.15 0.05 265)">1</div>
              <div><strong>Team reviews your report</strong><br /><span class="text-muted">The EagleCatch team verifies and logs the item with a unique ASKI ID.</span></div>
            </div>
            <div class="people">
              <div class="avatar" style="background:var(--accent);color:oklch(0.15 0.05 265)">2</div>
              <div><strong>Item appears on the board</strong><br /><span class="text-muted">It is added to the Find page so the owner can search and identify it.</span></div>
            </div>
            <div class="people">
              <div class="avatar" style="background:var(--brand)">3</div>
              <div><strong>Owner claims it</strong><br /><span class="text-muted">The owner submits a claim, the team verifies, and the item is returned.</span></div>
            </div>
          </div>
        </div>
      </section>
    </main>
    <footer class="site-footer">
      <div class="container">
        <span class="tag">EagleCatch &middot; ASKI</span>
        <span>&copy; 2026 ASKI Skills and Knowledge Institute. For ASKIans, By ASKIans.</span>
      </div>
    </footer>
    <script src="assets/js/data.js"></script>
    <script src="assets/js/main.js?v=4"></script>
    <script src="assets/js/report.js"></script>
    <a href="find.html" class="floating-cta" aria-label="Se
