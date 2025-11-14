# Service Management Platform

A React-based service management website where customers can post work requests and professionals can accept them. The platform takes a 10% commission from each transaction.

## Features

- **Customer Dashboard**: Post service jobs with details like title, description, service type, address, and budget
- **Professional Dashboard**: Browse and accept jobs matching their profession
- **Commission System**: Automatic 10% commission calculation (e.g., if customer pays 100Rs, platform gets 10Rs, professional gets 90Rs)
- **Job Management**: Track job status (open, in-progress, completed)
- **Payment Breakdown**: Clear visibility of commission and earnings for both parties

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Login/Register**: Choose whether you're a customer or professional
2. **For Customers**: 
   - Post jobs with service requirements
   - Track your posted jobs and their status
   - View payment breakdowns

3. **For Professionals**:
   - Browse available jobs matching your profession
   - Accept jobs you want to work on
   - Mark jobs as completed when done
   - Track your earnings and platform commission

## Technologies Used

- React 18
- React Router DOM
- Vite
- CSS3 (Modern styling with gradients and animations)

## Project Structure

```
src/
  ├── components/
  │   ├── Login.jsx          # Login/Registration component
  │   ├── CustomerDashboard.jsx    # Customer interface
  │   ├── ProfessionalDashboard.jsx # Professional interface
  │   └── *.css              # Component styles
  ├── App.jsx                # Main app component with routing
  ├── main.jsx               # Entry point
  └── index.css              # Global styles
```

## Commission System

- Customer pays the full budget amount (e.g., 100Rs)
- Platform commission: 10% (10Rs)
- Professional earnings: 90% (90Rs)
- All calculations are displayed transparently to both parties

