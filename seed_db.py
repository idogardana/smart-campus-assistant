from backend.app.database import SessionLocal, engine
from backend.app import models

models.Base.metadata.create_all(bind=engine)

def reset_and_seed():
    db = SessionLocal()
    try:
        db.query(models.CampusKnowledge).delete()
        db.query(models.Interaction).delete()

        campus_data = [

            # ── מיקומים ושעות ──
            models.CampusKnowledge(topic="מזכירות",
                information="מזכירות: בניין 4, קומה 2. שעות פעילות: ראשון-חמישי 08:00-16:00. טלפון: 03-1234567. אימייל: office@cyberpro.com"),

            models.CampusKnowledge(topic="ספרייה",
                information="ספרייה: בניין 2, קומה 1. שעות פעילות: ראשון-חמישי 08:00-20:00, שישי 08:00-13:00."),

            models.CampusKnowledge(topic="מעבדת סייבר",
                information="מעבדת סייבר: בניין 1, חדר 102. פתוחה 24/7 לסטודנטים עם כרטיס מגנטי."),

            models.CampusKnowledge(topic="מעבדת מחשבים",
                information="מעבדת מחשבים כללית: בניין 3, חדר 201. שעות פעילות: ראשון-חמישי 08:00-22:00."),

            models.CampusKnowledge(topic="קפיטריה",
                information="קפיטריה: בניין מרכזי, קומה 0. שעות: ראשון-חמישי 07:30-18:00, שישי 07:30-13:00."),

            models.CampusKnowledge(topic="חדר כושר",
                information="חדר כושר: בניין 5, קומה -1. שעות: ראשון-חמישי 06:00-22:00, שישי 06:00-14:00. כניסה עם כרטיס סטודנט."),

            models.CampusKnowledge(topic="חניה",
                information="חניה: חניון תת-קרקעי מתחת לבניין 1. כניסה מרחוב הטכנולוגיה. חניה חינם לסטודנטים עם מדבקה."),

            # ── מבחנים ולוחות זמנים ──
            models.CampusKnowledge(topic="מועד מבחנים",
                information="מועד א' מבחנים: 15-30 בינואר 2026. מועד ב': 20 פברואר - 5 מרץ 2026. לוח המבחנים המלא זמין בפורטל הסטודנטים."),

            models.CampusKnowledge(topic="סמסטר",
                information="סמסטר א': אוקטובר-ינואר. סמסטר ב': מרץ-יולי. בין הסמסטרים: חופשת פברואר (שלושה שבועות)."),

            models.CampusKnowledge(topic="הגשות",
                information="הגשת פרויקטים ועבודות: דרך פורטל הסטודנטים בלבד. הגשה מאוחרת גוררת הפחתה של 10 נקודות ליום."),

            # ── שירותי סטודנטים ──
            models.CampusKnowledge(topic="שכר לימוד",
                information="שכר לימוד שנתי: 28,000 ש\"ח. ניתן לפרוס ל-10 תשלומים. לבעלי זכאות מלגה יש לפנות למדור כספים."),

            models.CampusKnowledge(topic="מלגות",
                information="מלגות הצטיינות: לסטודנטים עם ממוצע 90+. מלגות סוציו-אקונומיות: פנייה למדור סיוע סוציאלי. טופס בקשה בפורטל."),

            models.CampusKnowledge(topic="פורטל סטודנטים",
                information="פורטל סטודנטים: portal.cyberpro.ac.il. שם משתמש: מספר ת.ז. סיסמה ראשונית: תאריך לידה (DDMMYYYY). לאיפוס: it@cyberpro.com"),

            models.CampusKnowledge(topic="אישורי לימודים",
                information="אישור לימודים/ציונים: ניתן להפיק מהפורטל מיידית. אישור חתום על ידי המוסד: בקשה במזכירות, מוכן תוך 3 ימי עסקים."),

            models.CampusKnowledge(topic="נכות ונגישות",
                information="מרכז נגישות: בניין 4, קומה 1. ממונה נגישות: נעמה לוי, 03-1234568. ארכות במבחנים וסיוע אקדמי לזכאים."),

            # ── תמיכה טכנית ──
            models.CampusKnowledge(topic="תמיכה טכנית",
                information="מחלקת IT: בניין 1, חדר 005. שעות: ראשון-חמישי 08:00-17:00. טלפון: 03-1234569. אימייל: it@cyberpro.com. תקלות דחופות: שלח וואטסאפ."),

            models.CampusKnowledge(topic="WiFi",
                information="רשת WiFi: CyberPro-Student. התחברות: שם משתמש ת.ז + @cyberpro, סיסמה: כמו הפורטל. בעיות חיבור: it@cyberpro.com"),

            models.CampusKnowledge(topic="תוכנות",
                information="סטודנטים מקבלים רישיון חינם ל: Microsoft Office 365, GitHub Pro, JetBrains (PyCharm/WebStorm), וVisualize Studio. הורדה דרך הפורטל."),

            # ── אירועים ──
            models.CampusKnowledge(topic="טקס סיום",
                information="טקס סיום מחזור לוחמים להייטק: מאי 2026. מיקום: אולם האירועים, בניין 6. הזמנות יישלחו בדוא\"ל חודש מראש."),

            models.CampusKnowledge(topic="יום פתוח",
                information="יום פתוח למתעניינים: ראשון בכל חודש, 17:00-20:00. הרשמה: אתר CyberPro. סטודנטים מוזמנים להשתתף כמדריכים."),

            models.CampusKnowledge(topic="האקתון",
                information="האקתון שנתי: מרץ 2026, 48 שעות רצופות. פרס ראשון: 10,000 ש\"ח. הרשמה דרך הפורטל עד פברואר 2026."),

            # ── קורסים ──
            models.CampusKnowledge(topic="מסלולי לימוד",
                information="מסלולים: סייבר התקפי, הגנת סייבר, פיתוח Full-Stack, Data Science, ו-DevOps. משך כל מסלול: 18 חודשים. 6 ימים בשבוע."),

            models.CampusKnowledge(topic="פרויקט גמר",
                information="פרויקט גמר: מתחיל בחודש 14 ללימודים. עובדים בקבוצות של 3-4. מנטור מהתעשייה מוקצה לכל קבוצה. הגשה חודשיים לפני טקס הסיום."),

            models.CampusKnowledge(topic="התמחות",
                information="התמחות: חובה, 3 חודשים. מחלקת קריירה מסייעת בשיבוץ. ניתן לבצע במקביל לחודשי הלימוד האחרונים."),

            # ── קריירה ──
            models.CampusKnowledge(topic="מחלקת קריירה",
                information="מחלקת קריירה: בניין 4, קומה 3. ימי ייעוץ: ראשון ורביעי 10:00-16:00. career@cyberpro.com. מסייעת בקורות חיים, הכנה לראיון, ושיבוץ להתמחות."),

            models.CampusKnowledge(topic="שיעור תעסוקה",
                information="שיעור תעסוקה של בוגרים: 94% תוך 6 חודשים מסיום. שכר ממוצע של בוגר שנה ראשונה: 18,000-22,000 ש\"ח. נתונים ממחקר בוגרים 2024."),
        ]

        db.add_all(campus_data)
        db.commit()
        print(f"✅ Database seeded successfully with {len(campus_data)} entries!")

    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    reset_and_seed()