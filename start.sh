#!/bin/bash
echo "======================================================================"
echo "               ProofGap AI - Financial Automation With Proof"
echo "                 Razorpay AI Buildathon (Track 04)"
echo "======================================================================"
echo ""

echo "Starting FastAPI Backend Server on http://localhost:8000 ..."
(cd backend && python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload) &

echo "Starting React Frontend on http://localhost:5173 ..."
(cd frontend && npm run dev) &

echo ""
echo "Both servers running in background!"
echo "Frontend: http://localhost:5173"
echo "Backend API Docs: http://localhost:8000/docs"
wait
