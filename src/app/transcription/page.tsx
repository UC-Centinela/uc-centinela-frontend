import TranscriptionForm from './components/TranscriptionForm';

export default function TranscriptionPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Transcripción de Video</h1>
      <TranscriptionForm />
    </div>
  );
}
