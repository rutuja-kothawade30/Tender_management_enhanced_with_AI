from app.models import CompanyProfile, TenderClause
from app.ai.eligibility import evaluate_eligibility

def test_eligibility_engine():
    print("Initializing test eligibility checks...")
    
    # 1. Create a simulated company profile
    profile = CompanyProfile(
        company_name="BuildCorp Test Systems",
        turnover=100.0, # Rs. 100 Cr
        experience_years=10,
        similar_projects_completed=5,
        max_project_value=120.0, # Max project value completed is 120 Cr
        certifications="ISO 9001, Class-A Contractor License",
        equipment="1 segment launcher, 2 concrete mixers",
        manpower_count=50
    )

    # 2. Create mock clauses with PASS and FAIL scenarios
    clauses = [
        # Financial turnover: Required 60 Cr, profile has 100 Cr -> PASS
        TenderClause(
            id=1,
            category="financial",
            clause_text="Average annual turnover must be Rs. 60.0 Crores in last 3 financial years.",
            required_value="Turnover >= 60.0 Cr",
            confidence=0.98
        ),
        # Experience: Required 150 Cr single contract, profile has 120 Cr -> FAIL
        TenderClause(
            id=2,
            category="experience",
            clause_text="Bidders must have completed a single similar contract of value Rs. 150.0 Crores.",
            required_value="Experience >= 150.0 Cr",
            confidence=0.95
        ),
        # Documentation: Required ISO 9001, profile has it -> PASS
        TenderClause(
            id=3,
            category="documentation",
            clause_text="Mandatory possession of ISO 9001 certification.",
            required_value="ISO 9001",
            confidence=0.99
        ),
        # Technical: Required 2 segment launchers, profile has 1 -> FAIL
        TenderClause(
            id=4,
            category="technical",
            clause_text="Must possess 2 segment launchers on site.",
            required_value="Segment Launchers >= 2",
            confidence=0.92
        )
    ]

    # 3. Evaluate eligibility
    score, results = evaluate_eligibility(profile, clauses)
    
    print(f"\nEvaluation Complete. Eligibility Rating Score: {score}%")
    print("-" * 80)
    for res in results:
        print(f"[{res['status']}] Category: {res['category']}")
        print(f"  Clause: {res['clause_text']}")
        print(f"  Reason: {res['explanation']}")
        print(f"  User Value matched: {res['user_value']}")
        print("-" * 80)
        
    # Assertions
    assert results[0]['status'] == 'PASS', "Financial turnover should PASS"
    assert results[1]['status'] == 'FAIL', "Experience should FAIL (120 Cr < 150 Cr)"
    assert results[2]['status'] == 'PASS', "ISO 9001 documentation should PASS"
    assert results[3]['status'] == 'FAIL', "Segment launchers technical should FAIL (1 < 2)"
    
    # 4. Test calculate_decision_support (v3.0)
    from app.ai.eligibility import calculate_decision_support
    from app.models import DocumentChecklist
    from unittest.mock import MagicMock
    
    checklist = [
        DocumentChecklist(id=1, document_name="ISO 9001 Certificate", status="vault_matched"),
        DocumentChecklist(id=2, document_name="Audited Financial Statements", status="missing"),
        DocumentChecklist(id=3, document_name="Earnest Money Deposit receipt", status="missing")
    ]
    
    evaluated_clauses = []
    for r in results:
        m = MagicMock()
        m.status = r["status"]
        m.category = r["category"]
        m.clause_text = r["clause_text"]
        evaluated_clauses.append(m)
        
    metrics = calculate_decision_support(profile, evaluated_clauses, checklist, tender_value=180.0, org_name="NHAI")
    
    print("\nDecision Support Metrics:")
    for k, v in metrics.items():
        print(f"  {k}: {v}")
        
    assert metrics["go_no_go_verdict"] == "Cautious", "Verdict should be Cautious because eligibility is 55%"
    assert metrics["suitability_score"] > 0, "Suitability score should be generated"
    assert metrics["bid_readiness_score"] == 40.0, "Readiness score should be calculated"
    
    print("\nAll eligibility and decision support engine assertions PASSED successfully!")

if __name__ == "__main__":
    test_eligibility_engine()