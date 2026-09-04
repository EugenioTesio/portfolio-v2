# Attaining 100% Test Coverage in FastAPI with SQLAlchemy Fixtures

**Published:** January 15, 2025  
**Author:** Eugenio Tesio  
**Read Time:** 5 min read  
**Topic:** Python / FastAPI & Backend Quality  

---

Reaching **100% meaningful code coverage** in backend services is often dismissed as impractical vanity. However, when developing critical adoption workflow and home study backend pipelines, high test coverage is your only real safeguard against subtle regression bugs.

At **PairTree**, an adoption enablement platform, we engineered **FastAPI** microservices using **SQLAlchemy** and **Alembic**, maintaining 100% test coverage backed by robust `pytest` fixtures.

```
       +---------------------------------------------+
       |             pytest Test Runner              |
       +----------------------+----------------------+
                              |
                Pytest Session Fixtures
                              |
       +----------------------v----------------------+
       |        In-Memory SQLite / Docker PG         |
       |  (Isolated Database Schema per Test Suite)  |
       +----------------------+----------------------+
                              |
       +----------------------v----------------------+
       |            FastAPI TestClient               |
       |  - Dependency Overrides (get_db, auth)      |
       |  - Async Request Dispatches                 |
       |  - Exact Response Schema Assertions         |
       +---------------------------------------------+
```

## The Recipe for Frictionless Backend Tests

### 1. The Rollback Database Fixture
Instead of slowly wiping and recreating tables between tests, we spin up an isolated transaction per test and rollback at teardown:

```python
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base, get_db

@pytest.fixture(scope="session")
def engine():
    return create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})

@pytest.fixture
def db_session(engine):
    Base.metadata.create_all(bind=engine)
    connection = engine.connect()
    transaction = connection.begin()
    Session = sessionmaker(bind=connection)
    session = Session()

    yield session

    session.close()
    transaction.rollback()
    connection.close()
```

### 2. Dependency Overrides in FastAPI
FastAPI's dependency injection system makes mocking and isolating database calls clean:

```python
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client(db_session):
    def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
```

## Eliminating Untested Edge Cases

To hit 100% coverage reliably:
- Test error handlers and custom HTTP status exceptions (400, 401, 404, 422, 500).
- Test Alembic migration downgrade and upgrade scripts in CI.
- Validate Pydantic schema validation failures explicitly.

Combined with our GitHub Actions CI pipeline, no pull request could be merged if code coverage dropped by even 0.1%.
