# Raffle Application

## Environment Setup

1. Copy the example environment file:
```bash
cp src/environments/environment.example.ts src/environments/environment.ts
```

2. Update the environment.ts file with your actual configuration values:
- Firebase configuration from your Firebase Console
- API URL for your backend service

3. For production, create environment.prod.ts with the same structure but production values.

## Development

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. 