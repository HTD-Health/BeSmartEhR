import { Mic, Pause, PlayArrow, Stop } from '@mui/icons-material';
import { Box, Button, Card, Grid2, Typography } from '@mui/material';
import { JSX, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useGetPatient } from '../../api/queries';

import AllergiesSummary from '@/components/allergies_summary/allergies_summary';
import ConditionsSummary from '@/components/conditions_summary/conditions_summary';
import CustomSnackbar from '@/components/custom_snackbar/custom_snackbar';
import MedicationsSummary from '@/components/medications_summary/medications_summary';
import PatientCard from '@/components/patient_card/patient_card';
import SmartAppBar from '@/components/smart_app_bar/smart_app_bar';
import routes from '@/routes';

const PatientProfile = (): JSX.Element => {
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [permissionStatus, setPermissionStatus] = useState<string>('unknown');
    const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const { error, data, isLoading } = useGetPatient();
    const navigate = useNavigate();

    useEffect(() => {
        if (error) {
            setErrorMessage('Failed to get patient data');
        }
    }, [error]);

    useEffect(() => {
        // Check initial permission status
        const checkPermissions = async (): Promise<void> => {
            try {
                const permissions = await navigator.permissions.query({ name: 'microphone' as PermissionName });
                setPermissionStatus(permissions.state);
                setShowPermissionPrompt(permissions.state === 'prompt');
                permissions.addEventListener('change', (e) => {
                    const newState = (e.target as PermissionStatus).state;
                    setPermissionStatus(newState);
                    setShowPermissionPrompt(newState === 'prompt');
                });
            } catch {
                setPermissionStatus('error checking permissions');
                setShowPermissionPrompt(true);
            }
        };
        checkPermissions().catch(() => {
            setPermissionStatus('error checking permissions');
            setShowPermissionPrompt(true);
        });
    }, []);

    const requestPermission = async (): Promise<void> => {
        try {
            // First try to get a temporary stream just to trigger the permission prompt
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false
            });
            // Immediately stop the stream since we just wanted the permission
            stream.getTracks().forEach((track) => track.stop());
            // Check the new permission state
            const permissions = await navigator.permissions.query({ name: 'microphone' as PermissionName });
            setPermissionStatus(permissions.state);
            setShowPermissionPrompt(permissions.state === 'prompt');

            if (permissions.state === 'granted') {
                setErrorMessage('Microphone access granted. You can now start recording.');
            }
        } catch (e) {
            const err = e as Error;
            handleError(err, 'Failed to request microphone permission');
        }
    };

    const handleError = (err: Error, context: string): void => {
        let troubleshooting = '';
        if (err.name === 'NotAllowedError') {
            troubleshooting = `\n\nTroubleshooting:\n`;
            if (permissionStatus === 'denied') {
                troubleshooting += `- Microphone access is currently denied. Please check your browser settings or click the camera icon in the address bar to enable access.\n`;
                troubleshooting += `- If using Epic Hyperdrive, ensure microphone permissions are enabled in Epic settings.\n`;
            } else if (permissionStatus === 'prompt') {
                troubleshooting += `- Please allow microphone access when prompted.\n`;
            }
            troubleshooting += `- Current permission status: ${permissionStatus}`;
        }

        setErrorMessage(`${context}: ${err.name} - ${err.message}${troubleshooting}`);
    };

    const startRecording = async (): Promise<void> => {
        try {
            if (!navigator.mediaDevices?.getUserMedia) {
                throw new Error('MediaDevices API not available in this browser');
            }

            // Debug info about permissions and environment
            console.info('Checking permissions and environment...');
            console.info('User Agent:', navigator.userAgent);
            console.info('MediaDevices available:', !!navigator.mediaDevices);

            try {
                const permissions = await navigator.permissions.query({ name: 'microphone' as PermissionName });
                console.info('Microphone permission state:', permissions.state);
                permissions.addEventListener('change', (e) => {
                    console.info('Permission state changed:', (e.target as PermissionStatus).state);
                });
            } catch (permErr) {
                console.info('Error querying permissions:', permErr);
            }

            // Log iframe context
            console.info('Is in iframe:', window !== window.parent);
            console.info(
                'Iframe permissions policy:',
                'featurePolicy' in document
                    ? (document as any).featurePolicy?.allowsFeature('microphone')
                    : 'Feature Policy API not available'
            );

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                },
                video: false
            });

            console.info('Stream obtained successfully');
            console.info(
                'Audio tracks:',
                stream.getAudioTracks().map((track) => ({
                    label: track.label,
                    enabled: track.enabled,
                    muted: track.muted,
                    readyState: track.readyState
                }))
            );

            const recorder = new MediaRecorder(stream, {
                mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/ogg'
            });
            console.info('MediaRecorder created with mimeType:', recorder.mimeType);

            const chunks: BlobPart[] = [];

            recorder.ondataavailable = (e) => {
                console.info('Data available event, chunk size:', e.data.size);
                if (e.data.size > 0) {
                    chunks.push(e.data);
                }
            };

            recorder.onerror = () => {
                handleError(new Error('MediaRecorder failed'), 'MediaRecorder error');
            };

            recorder.onstop = () => {
                console.info('Recording stopped, creating blob from chunks:', chunks.length);
                const blob = new Blob(chunks, { type: recorder.mimeType });
                console.info('Blob created, size:', blob.size);
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
            };

            recorder.start(1000); // Get data every second
            console.info('Recording started');
            setMediaRecorder(recorder);
            setIsRecording(true);

            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
                setAudioUrl(null);
            }
        } catch (e) {
            const err = e as Error;
            console.error('Full error details:', {
                name: err.name,
                message: err.message,
                stack: err.stack,
                constraints: navigator.mediaDevices?.getSupportedConstraints()
            });
            handleError(err, 'Failed to start recording');
        }
    };

    const stopRecording = (): void => {
        try {
            if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                mediaRecorder.stop();
                mediaRecorder.stream.getTracks().forEach((track) => track.stop());
                setIsRecording(false);
                setMediaRecorder(null);
            }
        } catch (e) {
            const err = e as Error;
            handleError(err, 'Failed to stop recording');
        }
    };

    const togglePlayback = (): void => {
        if (!audioRef.current) {
            setErrorMessage('Audio element not found');
            return;
        }

        try {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch((err) => {
                    handleError(err, 'Failed to play audio');
                });
            }
            setIsPlaying(!isPlaying);
        } catch (e) {
            const err = e as Error;
            handleError(err, 'Error during playback');
        }
    };

    useEffect(
        () => () => {
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
        },
        [audioUrl]
    );

    const getPermissionColor = (status: string): string => {
        switch (status) {
            case 'granted':
                return 'success.main';
            case 'denied':
                return 'error.main';
            default:
                return 'text.secondary';
        }
    };

    return (
        <>
            <SmartAppBar />
            <CustomSnackbar
                open={Boolean(errorMessage)}
                onClose={() => setErrorMessage('')}
                message={errorMessage}
                severity="error"
            />
            <Box
                sx={{
                    p: '2rem'
                }}
            >
                <Grid2 container spacing={2}>
                    <Grid2
                        size={{
                            xs: 12,
                            md: 6
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                height: '100%'
                            }}
                        >
                            <PatientCard patient={data} isLoading={isLoading} />
                        </Box>
                    </Grid2>
                    <Grid2
                        size={{
                            xs: 12,
                            md: 6
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                                height: '100%'
                            }}
                        >
                            <Grid2 container spacing={2}>
                                <Grid2 size={12}>
                                    <ConditionsSummary />
                                </Grid2>
                                <Grid2
                                    size={{
                                        xs: 12,
                                        md: 6
                                    }}
                                >
                                    <MedicationsSummary />
                                </Grid2>
                                <Grid2
                                    size={{
                                        xs: 12,
                                        md: 6
                                    }}
                                >
                                    <AllergiesSummary />
                                </Grid2>
                                <Grid2 size={12}>
                                    <Card
                                        sx={{
                                            p: 2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: 2
                                        }}
                                    >
                                        <Typography variant="h6">Voice Recording Test</Typography>
                                        <Typography variant="body2" color={getPermissionColor(permissionStatus)}>
                                            Microphone Permission: {permissionStatus}
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                gap: 2,
                                                flexDirection: 'column',
                                                alignItems: 'center'
                                            }}
                                        >
                                            {(showPermissionPrompt || permissionStatus === 'denied') && (
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    onClick={requestPermission}
                                                    startIcon={<Mic />}
                                                >
                                                    Request Microphone Access
                                                </Button>
                                            )}
                                            <Box sx={{ display: 'flex', gap: 2 }}>
                                                <Button
                                                    variant="contained"
                                                    color={isRecording ? 'error' : 'primary'}
                                                    startIcon={isRecording ? <Stop /> : <Mic />}
                                                    onClick={isRecording ? stopRecording : startRecording}
                                                    disabled={permissionStatus !== 'granted'}
                                                >
                                                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                                                </Button>
                                                {audioUrl && (
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        startIcon={isPlaying ? <Pause /> : <PlayArrow />}
                                                        onClick={togglePlayback}
                                                    >
                                                        {isPlaying ? 'Pause' : 'Play'}
                                                    </Button>
                                                )}
                                            </Box>
                                        </Box>
                                        {audioUrl && (
                                            <audio
                                                ref={audioRef}
                                                src={audioUrl}
                                                onEnded={() => setIsPlaying(false)}
                                                style={{ display: 'none' }}
                                            >
                                                <track kind="captions" srcLang="en" label="English captions" />
                                            </audio>
                                        )}
                                    </Card>
                                </Grid2>
                            </Grid2>
                            <Button variant="contained" sx={{ mt: '0.5rem' }} onClick={() => navigate(routes.goals)}>
                                Goals
                            </Button>
                        </Box>
                    </Grid2>
                </Grid2>
            </Box>
        </>
    );
};

export default PatientProfile;
