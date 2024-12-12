import { useEffect, type FC } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

import { log, LogLevel } from '../../utils/log';

import { type CommandExecutedEvent } from '../../types/TerminalEvents';

import { close, connect } from '../../observables/SshConnectionService';
import { toggleModal } from '../../observables/ModalStateService';
import { registerAsyncCallback } from '../../observables/RTNEventService';

import { useTerminal } from '../../hooks/useTerminal';
import { scpTransfer } from '../../observables/ScpTransferService';

interface ToolbarProps {}

const logModule = 'Toolbar';

// TODO: Improve comments

const Toolbar: FC<ToolbarProps> = ({}) => {
  const { terminal, terminalId, sessionId, connectionStatus } = useTerminal();
  const { connected, isConnecting } = connectionStatus;

  useEffect(() => {
    log(LogLevel.DEBUG, logModule, 'mounted');
    return () => {
      log(LogLevel.DEBUG, logModule, 'cleanup');
    };
  }, []);

  useEffect(() => {
    log(
      LogLevel.DEBUG,
      logModule,
      'connectionStatus changed - connected',
      connectionStatus.connected
    );
  }, [connectionStatus]);

  const toggleLogs = () => {
    log(LogLevel.DEBUG, logModule, 'toggleLogs pressed');
    toggleModal(terminalId);
  };

  const onToggleConnectionPress = () => {
    if (connected) {
      close(sessionId);
    } else {
      connect(sessionId);
    }
  };

  const listDirectory = () => {
    console.log('listDirectory pressed');
    log(LogLevel.WARN, logModule, 'toggleLogs pressed');
    // dispatch({ type: ActionType.SSH_EXEC, payload: 'ls' });
  };

  const downloadTest = () => {
    if (!terminal) {
      log(LogLevel.WARN, logModule, 'downloadTest error: terminal unavailable');
      return;
    }

    log(LogLevel.DEBUG, logModule, 'downloadTest pressed');

    const from = '/home/tekton/test_scp_read.webm';
    const to = 'test_scp_read.webm';

    scpTransfer('download', from, to, terminal);
  };

  const uploadTest = () => {
    if (!terminal) {
      log(LogLevel.WARN, logModule, 'uploadTest error: terminal unavailable');
      return;
    }

    log(LogLevel.DEBUG, logModule, 'uploadTest pressed');

    const from = 'test_scp_write.webm';
    const to = '/home/tekton/test_scp_write.webm';

    scpTransfer('upload', to, from, terminal);
  };

  // TODO: Improve event data from native and test with large cmd output.
  const executeCommand = () => {
    const command = 'echo "Hello World"';
    const callbackId = registerAsyncCallback<CommandExecutedEvent>(
      'onCommandExecuted',
      ({ output, error }: CommandExecutedEvent) => {
        if (error) {
          log(
            LogLevel.INFO,
            logModule,
            `error executing command: ${error} [${callbackId}]`
          );
          return;
        }

        log(
          LogLevel.INFO,
          logModule,
          `command executed successfully: Output - ${output}`
        );
      }
    );

    terminal?.executeCommand(callbackId, command);

    log(
      LogLevel.INFO,
      logModule,
      `command '${command}' sent with callback ID ${callbackId}`
    );
  };

  const connectionColor = connected ? 'green' : 'red';
  const activityIndicator = isConnecting ? 'yellow' : connectionColor;

  return (
    <View style={styles.toolbar}>
      <View
        style={[styles.statusDot, { backgroundColor: activityIndicator }]}
      />
      <TouchableOpacity
        style={[isConnecting ? styles.disabledButton : styles.button]}
        onPress={onToggleConnectionPress}
        disabled={isConnecting}
      >
        <Text style={styles.buttonText}>
          {connected ? 'Disconnect' : 'Connect'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={listDirectory}>
        <Text style={styles.buttonText}>ls -la</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={downloadTest}>
        <Text style={styles.buttonText}>Download test</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={uploadTest}>
        <Text style={styles.buttonText}>Upload test</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={executeCommand}>
        <Text style={styles.buttonText}>Exec test</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={toggleLogs}>
        <Text style={styles.buttonText}>Open Scp History</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={toggleLogs}>
        <Text style={styles.buttonText}>Open Logs</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#777777',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  statusDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    margin: 10,
  },
});

export default Toolbar;
