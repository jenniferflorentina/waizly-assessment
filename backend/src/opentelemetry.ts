import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { WinstonInstrumentation } from '@opentelemetry/instrumentation-winston';
import { Resource } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

const traceExporter = new OTLPTraceExporter({
  url: 'http://localhost:4318/v1/traces', // Adjust this URL to your OTLP endpoint
});

const sdk = new NodeSDK({
  resource: new Resource({
    [ATTR_SERVICE_NAME]: 'test-nest',
  }),
  traceExporter,
  instrumentations: [
    getNodeAutoInstrumentations(),
    new WinstonInstrumentation({
      // Optional: Add Winston instrumentation configuration here
    }),
  ],
});

sdk.start();
// Ensure the SDK is shut down gracefully on process exit
process.on('SIGTERM', async () => {
  try {
    await sdk.shutdown();
  } catch (error) {
    // console.log('Error shutting down OpenTelemetry SDK', error);
  }
});
