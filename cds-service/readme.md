# HTD Health CDS Service

HTD Health CDS Service is a Node.js application that implements [Clinical Decision Support (CDS) Hooks](https://cds-hooks.org/) to provide healthcare-related recommendations and insights. This service is a demo app to showcase how to integrate with healthcare systems and provide real-time decision support for clinicians.

## Features

- **CDS Hooks Implementation**: Supports `patient-view`, `order-select`, and `order-sign` hooks.
- **FHIR Integration**: Processes FHIR resources such as [Patient](https://hl7.org/fhir/R4/patient.html), [Bundle](https://hl7.org/fhir/R4/bundle.html), and Medication-related resources e.g. [MedicationOrder](https://www.hl7.org/fhir/DSTU2/medicationorder.html).
- **Customizable Logging**: Uses [Winston](https://github.com/winstonjs/winston) for structured and customizable logging.
- **Error Handling**: Provides robust error handling.

## Prerequisites

- Node.js (v18 or later)
- npm or yarn
- A working knowledge of FHIR and CDS Hooks standards

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd cds-service
```

2. Install dependencies:

```bash
npm ci
```

3. Build the project:

```bash
npm run build
```

## Configuration

The application uses environment variables for configuration. You can set these variables in your environment or create a `.env` file in the root directory.

## Variable Default Value Description

## Environment Variables

| Variable  | Default Value | Description                                       |
| --------- | ------------- | ------------------------------------------------- |
| PORT      | `3010`        | Port on which the service runs.                   |
| LOG_LEVEL | `info`        | Logging level (e.g., `debug`, `info`, `warn`).    |
| NODE_ENV  | `development` | Environment mode (`development` or `production`). |

## Running the Service

### Development Mode

To run the service in development mode with hot-reloading:

```bash
npm run dev
```

### Production Mode

To run the service in production mode:

```bash
npm start
```

## Endpoints

1. CDS Services Discovery

- **URL**: `/cds-services`
- **Method**: `GET`
- **Description**: Lists all available CDS services.

2. Patient-View Hook

- **URL**: `/cds-services/patient-assessment`
- **Method**: `POST`
- **Description**: Provides routine check recommendations based on patient data.

3. Order-Select Hook

- **URL**: `/cds-services/order-assistant`
- **Method**: `POST`
- **Description**: Informs about medication when selecting orders.

4. Order-Sign Hook

- **URL**: `/cds-services/order-review`
- **Method**: `POST`
- **Description**: Reviews medication orders prior to signature.

5. Health Check

- **URL**: `/health`
- **Method**: `GET`
- **Description**: Returns the status of the service.

## Testing Instructions

### CDS Hooks Sandbox Testing

You can test this service using the CDS Hooks Sandbox:

1. Go to [https://sandbox.cds-hooks.org/](https://sandbox.cds-hooks.org/)
2. Click on "Settings" in the top right corner
3. Click "Add CDS Services"
4. Enter `https://cds-service.htdhealth.com/cds-services` as the discovery endpoint
5. Click "Save"

#### Using Different FHIR Servers and Patient Data

To use different FHIR servers and display different resources in the SMART app:

1. Click on "Settings" in the top right corner
2. Click "Change FHIR Server"
3. Change the default server URL (`https://launch.smarthealthit.org/v/r2/fhir`) to `https://r4.smarthealthit.org`
4. Click "Next" to update the FHIR server
5. Select a patient from the list
6. Click "Save" to update the patient

Using a different FHIR server allows you to access additional resources and test the service with a wider range of clinical data in the practitioner app.

#### Testing Specific Hooks

- **Patient-View Hook**: View the patient in the `Patient View` tab. The service will provide recommended check-ups based on patient demographics in the form of a Routine Health Assessment card.
- **Order-Select Hook**: Begin the process of ordering a medication in the `Rx View` tab. Start writing in the autocomplete input. Select the type, the dosage, and then the formulation. The service will provide relevant information about the selected medication in the form of a Order Selection Review card.
- **Order-Sign Hook**: When signing orders in the `Rx Sign` tab, the service will provide a final check for potential issues in the form of a Pre-Signature Order Review card.

### Epic Integration Testing

To test this service in Epic:

1. Contact Epic to acquire access to a vendor services account
2. Register this CDS Service in your Epic environment
3. Test the service in Hyperspace by accessing patient records and medication workflows

For detailed Epic integration instructions, please contact our support team.

## Project Structure

```
cds-service/
├── dist/                  # Compiled JavaScript files
├── src/
│   ├── controllers/       # Business logic for handling hooks
│   ├── middleware/        # Logging and error handling
│   ├── services/          # Reusable service logic
│   ├── config.ts          # Configuration settings
│   └── index.ts           # Application entry point
│   ├── routes.ts          # API routes
│   ├── types.ts           # Type definitions
└── .gitignore             # Ignored files and directories
├── package.json           # Project metadata and scripts
├── tsconfig.json          # TypeScript configuration
```

## Logging

The service uses [Winston](https://github.com/winstonjs/winston) for logging. Logs are categorized by levels (info, warn, error, etc.) and include custom icons for better readability. Logs are output to the console.

## Error Handling

The service includes a global error handler that ensures all errors are logged.

## Linting and Formatting

To lint the code:

```bash
npm run lint
```

To format the code:

```bash
npm run format
```

## Author

HTD Health
