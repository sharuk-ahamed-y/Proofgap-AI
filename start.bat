@echo off
echo ======================================================================
echo                ProofGap AI - Financial Automation With Proof
echo                  Razorpay AI Buildathon (Track 04)
echo ======================================================================
echo.

echo Starting FastAPI Backend Server on http://localhost:8000 ...
start "ProofGap AI Backend" cmd /k "cd backend && python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

echo Starting React Frontend on http://localhost:5173 ...
start "ProofGap AI Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers started!
echo Frontend: http://localhost:5173
echo Backend API Docs: http://localhost:8000/docs
echo.
