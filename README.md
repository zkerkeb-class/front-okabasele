# SonataAI Frontend

Océane Kabasele

## Overview
This is the frontend application for SonataAI, a web-based AI application. The frontend is built with modern web technologies to provide an intuitive user interface for interacting with the SonataAI backend services.

## Technologies
- Next.js
- TypeScript
- Tailwind CSS
- Mailpit : http://localhost:8025/

## Getting Started

### Prerequisites
- Node.js (v14.0.0 or later)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd front

# Install dependencies
npm install
# or
yarn install
```

### Development
```bash
# Start the development server
npm run dev
# or
yarn dev
```

### Building for Production
```bash
# Build the application
npm run build
# or
yarn build
```

## Architecture logicielle

```mermaid
---
config:
  look: classic
  layout: elk
  theme: mc
---
flowchart TD
 subgraph Frontend["Front - NextJS App"]
        UI["Interface Utilisateur NextJS"]
  end
 subgraph Auth["Service Authentification - NodeJS / Express"]
        AUTH["OAuth / OpenID Connect / JWT / Sécurité"]
  end
 subgraph DBService["Service Base de Données - NodeJS / Express"]
        DB["MongoDB : users, subscriptions, user_performance, partition"]
  end
 subgraph IAService["Service IA - NodeJS / Express"]
        AI["Analyse MIDI + IA / LLM / TTS / Comparaison partition"]
  end
 subgraph Metrics["Service Monitoring - NodeJS / Express"]
        METRICS["Prometheus Exporter / Grafana Dashboard"]
  end
 subgraph Notification["Service Notifications - NodeJS / Express"]
        NOTIF["Mails Nodemailer SMS Twilio Push"]
  end
 subgraph Paiement["Service Paiement - NodeJS / Express"]
        PAY["Stripe / PayPal API /Abonnements et Facturation"]
  end
    UI --> AUTH & AI & DB & PAY
    AUTH --> DB & NOTIF & METRICS
    AI --> DB & METRICS
    PAY --> DB & NOTIF & METRICS
    NOTIF --> UI & METRICS
    DB --> METRICS
    style UI fill:#fef9f3,stroke:#c08d3b,stroke-width:2px
    style AUTH fill:#e3f2fd,stroke:#1565c0
    style DB fill:#e8f5e9,stroke:#2e7d32
    style AI fill:#f3e5f5,stroke:#6a1b9a
    style METRICS fill:#ede7f6,stroke:#512da8
    style PAY fill:#fff3e0,stroke:#ef6c00
```

## UML

```mermaid
---
config:
  look: classic
  layout: elk
  theme: mc
---
classDiagram
    class User {
        ObjectId _id
        String firstname
        String lastname
        String username
        String email
        String password
        Phone phone
        OAuthAccount[] oauthAccounts
        Boolean isEmailVerified
        Boolean isPhoneVerified
        Date signupDate
        NotificationSettings notifications
    }
    class Subscription {
        ObjectId _id
        ObjectId user
        String stripeSubscriptionId
        String plan
        String status
        Date currentPeriodEnd
        Date createdAt
    }
    class Session {
        ObjectId _id
        ObjectId user
        ObjectId reference
        ObjectId[] performances
        String threadId
        Date startedAt
        Date endedAt
    }
    class Reference {
        ObjectId _id
        String name
        Section sections
    }
    class Section {
        MidiNote[] intro
        MidiNote[] verse
        MidiNote[] chorus
        MidiNote[] bridge
        MidiNote[] outro
    }
    class MidiNote {
        Number note
        Number velocity
        Number time
    }
    class Performance {
        ObjectId _id
        Date startedAt
        Date endedAt
        String section
        MidiNote[] midiNotes
        ObjectId user
        ObjectId session
        Feedback feedback
    }
    class Feedback {
        Number score
        String comments
        Mixed details
    }
    class Notification {
        ObjectId _id
        String userId
        String type
        String channel
        String to
        String content
        String status
        String error
        Boolean consent
        String unsubscribeToken
        Object meta
        Date createdAt
        Date updatedAt
    }
    User "1" -- "*" Subscription : has
    User "1" -- "*" Session : has
    User "1" -- "*" Performance : has
    Session "1" -- "*" Performance : includes
    Session "1" -- "1" Reference : for
    Reference "1" -- "1" Section : has
    Performance "1" -- "1" Feedback : has
    User "1" -- "*" Notification : receives
```


## AI Pipeline

```mermaid
---
config:
  look: classic
  layout: elk
  theme: mc
---
flowchart LR
    U[User] -->|Create session| S[Session]
    U -->|Play piano| P[MIDI Performance]
    U -->|Ask question| AI[AI Assistant]
    S -->|Session info| AI
    P -->|Performance data| AI
    AI -->|Uses tools| Tools[Analysis & Retrieval]
    Tools -->|Fetches| S
    Tools -->|Fetches| P
    AI -->|Responds| U
    
    %% Styling
    classDef user fill:#fef9f3,stroke:#c08d3b,stroke-width:2px;
    classDef ai fill:#f3e5f5,stroke:#6a1b9a;
    classDef tool fill:#ede7f6,stroke:#512da8;
    class U user;
    class AI ai;
    class Tools tool;
```