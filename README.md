# SkyCave Management System

A retro terminal-style hotel management system for handling guest check-ins, check-outs, and Thai immigration reporting.

![Terminal Style UI](https://via.placeholder.com/800x400?text=SkyCave+Terminal+UI)

## About

SkyCave Management System is a deliberately retro terminal-style application that simulates the look and feel of 1970s/1980s mainframe computer systems. The application handles basic hotel guest management operations with a focus on the aesthetic experience rather than modern UI patterns.

## Features

- **Guest Check-in**: Register new guests with contact details
- **Guest Check-out**: Process guest departures
- **Guest Viewing**: Review details of currently checked-in guests
- **TM30 Reporting**: Generate and print immigration reports for foreign guests in Thailand

## What is "Vibe-coding"?

This application is proudly "vibe-coded," meaning the aesthetic and user experience were prioritized over conventional modern design patterns. The term refers to:

- Prioritizing a specific visual and interactive feel (in this case, a retro terminal vibe)
- Embracing constraints and limitations of earlier computing eras
- Using modern technologies (React, TypeScript) to recreate vintage computing experiences
- Focusing on the emotional experience of using the app rather than pure efficiency

The green-on-black terminal interface, keyboard-centric navigation, and "mainframe" aesthetic are all intentional design choices to create an immersive retro computing experience.

## Technical Details

- Built with React and TypeScript
- Uses local storage for data persistence
- Features a custom terminal-style UI system
- Keyboard-driven interface with function key navigation

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Navigate with keyboard inputs (numbers 1-4, Enter, Escape)

## Thai Immigration Reporting

The TM30 report feature allows accommodation providers to fulfill their legal obligation to report foreign guests to Thai immigration authorities. The system prepopulates forms based on guest information and allows for printing standardized reports.
