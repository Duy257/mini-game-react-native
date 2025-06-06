import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Text, Animated, Dimensions} from 'react-native';

const {width: screenWidth} = Dimensions.get('window');

const LineProgressBar = ({
  progress = 0, // Giá trị từ 0 đến 100
  height = 8,
  backgroundColor = '#E0E0E0',
  progressColor = '#4CAF50',
  borderRadius = 4,
  animated = true,
  duration = 500,
  showPercentage = false,
  percentageStyle = {},
  containerStyle = {},
  width = screenWidth - 40,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const clampedProgress = Math.max(0, Math.min(100, progress));

    if (animated) {
      Animated.timing(animatedValue, {
        toValue: clampedProgress,
        duration: duration,
        useNativeDriver: false,
      }).start();
    } else {
      animatedValue.setValue(clampedProgress);
    }
  }, [progress, animated, duration]);

  const progressWidth = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [0, width],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.container, containerStyle]}>
      <View
        style={[
          styles.progressBarContainer,
          {
            height,
            backgroundColor,
            borderRadius,
            width,
          },
        ]}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progressWidth,
              backgroundColor: progressColor,
              borderRadius,
              height,
            },
          ]}
        />
      </View>

      {showPercentage && (
        <Text style={[styles.percentageText, percentageStyle]}>
          {Math.round(progress)}%
        </Text>
      )}
    </View>
  );
};

// Component với nhiều tùy chọn hơn
const AdvancedLineProgressBar = ({
  progress = 0,
  height = 8,
  backgroundColor = '#E0E0E0',
  progressColor = '#4CAF50',
  borderRadius = 4,
  animated = true,
  duration = 500,
  showPercentage = false,
  percentageStyle = {},
  containerStyle = {},
  width = screenWidth - 40,
  showGradient = false,
  gradientColors = ['#4CAF50', '#81C784'],
  striped = false,
  stripedColor = 'rgba(255, 255, 255, 0.2)',
  glowEffect = false,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const clampedProgress = Math.max(0, Math.min(100, progress));

    if (animated) {
      Animated.timing(animatedValue, {
        toValue: clampedProgress,
        duration: duration,
        useNativeDriver: false,
      }).start();
    } else {
      animatedValue.setValue(clampedProgress);
    }
  }, [progress, animated, duration]);

  const progressWidth = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [0, width],
    extrapolate: 'clamp',
  });

  type ProgressBarStyle = {
    width: Animated.Value | Animated.AnimatedInterpolation<string | number>;
    backgroundColor: string;
    borderRadius: number;
    height: number;
    shadowColor?: string;
    shadowOffset?: {width: number; height: number};
    shadowOpacity?: number;
    shadowRadius?: number;
    elevation?: number;
  };

  const getProgressBarStyle = (): ProgressBarStyle => {
    let style: ProgressBarStyle = {
      width: progressWidth,
      backgroundColor: progressColor,
      borderRadius,
      height,
    };

    if (glowEffect) {
      style = {
        ...style,
        shadowColor: progressColor,
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 4,
      };
    }

    return style;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View
        style={[
          styles.progressBarContainer,
          {
            height,
            backgroundColor,
            borderRadius,
            width,
          },
        ]}>
        <Animated.View style={[styles.progressBar, getProgressBarStyle()]}>
          {striped && (
            <View
              style={[
                styles.stripedPattern,
                {
                  backgroundColor: stripedColor,
                  height,
                  borderRadius,
                },
              ]}
            />
          )}
        </Animated.View>
      </View>

      {showPercentage && (
        <Text style={[styles.percentageText, percentageStyle]}>
          {Math.round(progress)}%
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  progressBarContainer: {
    overflow: 'hidden',
    justifyContent: 'center',
  },
  progressBar: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  percentageText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  stripedPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
});

// Component sử dụng
const ProgressBarExample = () => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          return 0;
        }
        return prev + 10;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={exampleStyles.container}>
      <Text style={exampleStyles.title}>Basic Progress Bar</Text>
      <LineProgressBar progress={progress} showPercentage={true} />

      <Text style={exampleStyles.title}>Custom Colors</Text>
      <LineProgressBar
        progress={progress}
        progressColor="#FF6B6B"
        backgroundColor="#FFE0E0"
        showPercentage={true}
        height={12}
      />

      <Text style={exampleStyles.title}>Thick Progress Bar</Text>
      <LineProgressBar
        progress={progress}
        height={20}
        progressColor="#2196F3"
        showPercentage={true}
        borderRadius={10}
      />

      <Text style={exampleStyles.title}>Advanced Progress Bar</Text>
      <AdvancedLineProgressBar
        progress={progress}
        showPercentage={true}
        glowEffect={true}
        progressColor="#9C27B0"
        height={16}
        borderRadius={8}
      />
    </View>
  );
};

const exampleStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    color: '#333',
  },
});

export default LineProgressBar;
export {AdvancedLineProgressBar, ProgressBarExample};
