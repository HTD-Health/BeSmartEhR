import MicIcon from '@mui/icons-material/Mic';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { Box, Button, Card, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useGetPatient } from '../../api/queries';

import AllergiesSummary from 'components/allergies_summary/allergies_summary';
import ConditionsSummary from 'components/conditions_summary/conditions_summary';
import CustomSnackbar from 'components/custom_snackbar/custom_snackbar';
import MedicationsSummary from 'components/medications_summary/medications_summary';
import PatientCard from 'components/patient_card/patient_card';
import SmartAppBar from 'components/smart_app_bar/smart_app_bar';
import routes from 'routes';

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
            } catch (err) {
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
            console.log('Checking permissions and environment...');
            console.log('User Agent:', navigator.userAgent);
            console.log('MediaDevices available:', !!navigator.mediaDevices);

            try {
                const permissions = await navigator.permissions.query({ name: 'microphone' as PermissionName });
                console.log('Microphone permission state:', permissions.state);
                permissions.addEventListener('change', (e) => {
                    console.log('Permission state changed:', (e.target as PermissionStatus).state);
                });
            } catch (permErr) {
                console.log('Error querying permissions:', permErr);
            }

            // Log iframe context
            console.log('Is in iframe:', window !== window.parent);
            console.log(
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

            console.log('Stream obtained successfully');
            console.log(
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
            console.log('MediaRecorder created with mimeType:', recorder.mimeType);

            const chunks: BlobPart[] = [];

            recorder.ondataavailable = (e) => {
                console.log('Data available event, chunk size:', e.data.size);
                if (e.data.size > 0) {
                    chunks.push(e.data);
                }
            };

            recorder.onerror = () => {
                handleError(new Error('MediaRecorder failed'), 'MediaRecorder error');
            };

            recorder.onstop = () => {
                console.log('Recording stopped, creating blob from chunks:', chunks.length);
                const blob = new Blob(chunks, { type: recorder.mimeType });
                console.log('Blob created, size:', blob.size);
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
            };

            recorder.start(1000); // Get data every second
            console.log('Recording started');
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
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
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
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                                height: '100%'
                            }}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <ConditionsSummary />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <MedicationsSummary />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <AllergiesSummary />
                                </Grid>
                                <Grid item xs={12}>
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
                                                    startIcon={<MicIcon />}
                                                >
                                                    Request Microphone Access
                                                </Button>
                                            )}
                                            <Box sx={{ display: 'flex', gap: 2 }}>
                                                <Button
                                                    variant="contained"
                                                    color={isRecording ? 'error' : 'primary'}
                                                    startIcon={isRecording ? <StopIcon /> : <MicIcon />}
                                                    onClick={isRecording ? stopRecording : startRecording}
                                                    disabled={permissionStatus !== 'granted'}
                                                >
                                                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                                                </Button>
                                                {audioUrl && (
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        startIcon={isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
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
                                </Grid>
                            </Grid>
                            <Button variant="contained" sx={{ mt: '0.5rem' }} onClick={() => navigate(routes.goals)}>
                                Goals
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default PatientProfile;
