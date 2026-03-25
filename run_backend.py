#!/usr/bin/env python
"""
Simple backend runner script that properly sets up the path
"""
import sys
import os

# Add backend to path
backend_path = os.path.join(os.path.dirname(__file__), "backend")
sys.path.insert(0, backend_path)
sys.path.insert(0, os.path.dirname(__file__))

# Now run uvicorn
import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "backend.main:app",
        host="0.0.0.0",
        port=8000,
        reload=False
    )
