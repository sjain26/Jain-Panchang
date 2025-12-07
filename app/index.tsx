import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Modal,
  ScrollView,
  Linking,
  Alert,
  Animated,
  Easing,
  PanResponder,
  Platform,
  ActivityIndicator,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Info,
  ChevronDown,
  FlipHorizontal,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react-native";
import { getMonthsForYear, YEARS, getCurrentMonthIndex } from "@/constants/calendarData";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const currentYear = new Date().getFullYear();
  const defaultYear = YEARS.includes(currentYear) ? currentYear : 2026;
  
  const [selectedYear, setSelectedYear] = useState<number>(defaultYear);
  const [currentMonths, setCurrentMonths] = useState(() => getMonthsForYear(defaultYear));
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(
    getCurrentMonthIndex()
  );
  const [showYearPicker, setShowYearPicker] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [currentZoomScale, setCurrentZoomScale] = useState<number>(1);
  const [imageLoading, setImageLoading] = useState<boolean>(true);

  const scrollViewRef = useRef<ScrollView>(null);

  // Animation values
  const flipAnim = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const imageOpacity = useRef(new Animated.Value(1)).current;
  
  // Refs for gesture handling
  const lastScale = useRef(1);
  const lastTranslateX = useRef(0);
  const lastTranslateY = useRef(0);
  const initialDistance = useRef(0);
  const imageContainerRef = useRef<View>(null);

  // Web: Mouse wheel zoom
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.2 : 0.2; // Scroll down = zoom out, up = zoom in
        const newScale = Math.max(1, Math.min(currentZoomScale + delta, 4));
        
        Animated.spring(scale, {
          toValue: newScale,
          friction: 7,
          tension: 40,
          useNativeDriver: true,
        }).start(() => {
          lastScale.current = newScale;
          setCurrentZoomScale(newScale);
        });
        
        if (newScale === 1) {
          Animated.parallel([
            Animated.spring(translateX, {
              toValue: 0,
              friction: 7,
              tension: 40,
              useNativeDriver: true,
            }),
            Animated.spring(translateY, {
              toValue: 0,
              friction: 7,
              tension: 40,
              useNativeDriver: true,
            }),
          ]).start(() => {
            lastTranslateX.current = 0;
            lastTranslateY.current = 0;
          });
        }
      };
      
      const container = document.querySelector('[data-zoom-area="true"]');
      if (container) {
        container.addEventListener('wheel', handleWheel as EventListener, { passive: false });
        return () => container.removeEventListener('wheel', handleWheel as EventListener);
      }
    }
  }, [currentMonthIndex, currentZoomScale]);

  // Sync currentMonths when selectedYear changes
  useEffect(() => {
    const months = getMonthsForYear(selectedYear);
    setCurrentMonths(months);
    setImageLoading(true); // Show loader when year changes
    console.log('🔄 Year changed, updated months:', {
      selectedYear,
      firstMonth: months[0]?.name,
      firstMonthUrl: months[0]?.imageUrl,
    });
  }, [selectedYear]);

  const getDistance = (touches: any[]) => {
    if (touches.length < 2) return 0;
    const [touch1, touch2] = touches;
    const dx = touch1.pageX - touch2.pageX;
    const dy = touch1.pageY - touch2.pageY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const resetZoom = () => {
    scale.setValue(1);
    translateX.setValue(0);
    translateY.setValue(0);
    lastScale.current = 1;
    lastTranslateX.current = 0;
    lastTranslateY.current = 0;
    setCurrentZoomScale(1);
  };

  const resetAll = () => {
    flipAnim.setValue(0);
    resetZoom();
    imageOpacity.setValue(1);
    setIsFlipped(false);
  };

  const goToPreviousMonth = () => {
    setImageLoading(true);
    Animated.timing(imageOpacity, {
      toValue: 0,
      duration: 150,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => {
      setCurrentMonthIndex((prev) => {
        if (prev > 0) {
          return prev - 1;
        } else {
          const newYear = selectedYear - 1;
          const newMonths = getMonthsForYear(newYear);
          setSelectedYear(newYear);
          setCurrentMonths(newMonths);
          return newMonths.length - 1;
        }
      });
      resetAll();
      Animated.timing(imageOpacity, {
        toValue: 1,
        duration: 150,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    });
  };

  const goToNextMonth = () => {
    setImageLoading(true);
    Animated.timing(imageOpacity, {
      toValue: 0,
      duration: 150,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => {
    setCurrentMonthIndex((prev) => {
        if (prev < currentMonths.length - 1) {
        return prev + 1;
      } else {
          const newYear = selectedYear + 1;
          setSelectedYear(newYear);
          setCurrentMonths(getMonthsForYear(newYear));
        return 0;
      }
    });
      resetAll();
      Animated.timing(imageOpacity, {
        toValue: 1,
        duration: 150,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    });
  };

  const goToCurrentMonth = () => {
    setImageLoading(true);
    Animated.timing(imageOpacity, {
      toValue: 0,
      duration: 150,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => {
      const todayYear = new Date().getFullYear();
      const targetYear = YEARS.includes(todayYear) ? todayYear : defaultYear;
    setCurrentMonthIndex(getCurrentMonthIndex());
      setSelectedYear(targetYear);
      setCurrentMonths(getMonthsForYear(targetYear));
      resetAll();
      Animated.timing(imageOpacity, {
        toValue: 1,
        duration: 150,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleYearSelect = (year: number) => {
    setImageLoading(true);
    console.log('Year selected:', year);
    const months = getMonthsForYear(year);
    console.log('First month image:', months[0].imageUrl);
    setSelectedYear(year);
    setCurrentMonths(months);
    setCurrentMonthIndex(0);
    setShowYearPicker(false);
    resetAll();
  };

  // Slide animation for flip (bidirectional swipe effect)
  const handleFlip = () => {
    const newFlippedState = !isFlipped;
    const toValue = newFlippedState ? 1 : 0;
    
    console.log('🔄 Flip animation:', {
      from: isFlipped ? 'back' : 'front',
      to: newFlippedState ? 'back' : 'front',
      toValue,
      currentFlipAnim: (flipAnim as any)._value,
    });
    
    setIsFlipped(newFlippedState);
    setImageLoading(true); // Show loader during flip
    
    Animated.timing(flipAnim, {
      toValue,
      duration: 350,
      easing: Easing.bezier(0.33, 1, 0.68, 1), // Smooth cubic-bezier easing
      useNativeDriver: true,
    }).start(() => {
      console.log('✅ Flip animation completed:', {
        isFlipped: newFlippedState,
        finalFlipAnim: (flipAnim as any)._value,
      });
      // Hide loader after animation completes
      setTimeout(() => setImageLoading(false), 100);
    });
  };

  // Smooth zoom in
  const handleZoomIn = () => {
    const newScale = Math.min(currentZoomScale + 0.5, 4);
    Animated.spring(scale, {
      toValue: newScale,
      friction: 7,
      tension: 40,
      useNativeDriver: true,
    }).start(() => {
      lastScale.current = newScale;
      setCurrentZoomScale(newScale);
    });
  };

  // Smooth zoom out
  const handleZoomOut = () => {
    const newScale = Math.max(currentZoomScale - 0.5, 1);
    
    if (newScale === 1) {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(translateX, {
        toValue: 0,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
      ]).start(() => {
        lastScale.current = 1;
        lastTranslateX.current = 0;
        lastTranslateY.current = 0;
        setCurrentZoomScale(1);
      });
    } else {
      Animated.spring(scale, {
        toValue: newScale,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }).start(() => {
        lastScale.current = newScale;
        setCurrentZoomScale(newScale);
      });
    }
  };

  // Reset zoom to 1x
  const handleResetZoom = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(translateX, {
        toValue: 0,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start(() => {
    lastScale.current = 1;
    lastTranslateX.current = 0;
    lastTranslateY.current = 0;
      setCurrentZoomScale(1);
    });
  };

  // Swipe detection for flip
  const swipeStartX = useRef(0);
  const swipeStartY = useRef(0);
  
  // Double tap detection
  const lastTap = useRef(0);
  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (now - lastTap.current < DOUBLE_TAP_DELAY) {
      // Double tap detected
      const targetScale = currentZoomScale > 1 ? 1 : 2.5;
      
      Animated.spring(scale, {
        toValue: targetScale,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }).start(() => {
        lastScale.current = targetScale;
        setCurrentZoomScale(targetScale);
      });
      
      if (targetScale === 1) {
        Animated.parallel([
          Animated.spring(translateX, {
            toValue: 0,
            friction: 7,
            tension: 40,
            useNativeDriver: true,
          }),
          Animated.spring(translateY, {
            toValue: 0,
            friction: 7,
            tension: 40,
            useNativeDriver: true,
          }),
        ]).start(() => {
          lastTranslateX.current = 0;
          lastTranslateY.current = 0;
        });
      }
    }
    lastTap.current = now;
  };

  // Pan Responder for pinch-to-zoom and swipe-to-flip
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt) => {
        // Only handle double tap, don't capture all touches
        handleDoubleTap();
        swipeStartX.current = evt.nativeEvent.pageX;
        swipeStartY.current = evt.nativeEvent.pageY;
        return false; // Don't capture on start, wait for move
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Enable for 2-finger pinch
        if (evt.nativeEvent.touches.length === 2) {
          return true;
        }
        // Enable for single finger drag when zoomed
        if (lastScale.current > 1.01 && evt.nativeEvent.touches.length === 1) {
          return Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2;
        }
        // Enable for horizontal swipe when not zoomed (for flip)
        if (lastScale.current <= 1.01 && evt.nativeEvent.touches.length === 1 && currentMonthIndex < 12) {
          // More sensitive swipe detection
          return Math.abs(gestureState.dx) > 10 || Math.abs(gestureState.vx) > 0.2;
        }
        return false;
      },
      onPanResponderGrant: (evt) => {
        if (evt.nativeEvent.touches.length === 2) {
          initialDistance.current = getDistance(evt.nativeEvent.touches);
          console.log('📌 Pinch started, initial distance:', initialDistance.current);
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        // Pinch to zoom
        if (evt.nativeEvent.touches.length === 2) {
          const currentDistance = getDistance(evt.nativeEvent.touches);
          if (initialDistance.current > 0) {
            const scaleChange = currentDistance / initialDistance.current;
            const newScale = Math.max(1, Math.min(lastScale.current * scaleChange, 4));
            scale.setValue(newScale);
            console.log('🔍 Pinch zoom:', { currentDistance, initialDistance: initialDistance.current, scaleChange, newScale });
          }
        } 
        // Pan when zoomed
        else if (evt.nativeEvent.touches.length === 1 && lastScale.current > 1.01) {
          const currentScale = lastScale.current;
          const maxTranslateX = (SCREEN_WIDTH * (currentScale - 1)) / 2;
          const maxTranslateY = (SCREEN_HEIGHT * 0.6 * (currentScale - 1)) / 2;
          
          const newTranslateX = Math.max(
            -maxTranslateX,
            Math.min(lastTranslateX.current + gestureState.dx, maxTranslateX)
          );
          const newTranslateY = Math.max(
            -maxTranslateY,
            Math.min(lastTranslateY.current + gestureState.dy, maxTranslateY)
          );
          
          translateX.setValue(newTranslateX);
          translateY.setValue(newTranslateY);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        const currentScale = (scale as any)._value || 1;
        
        // Update last scale and translate values
        if (evt.nativeEvent.touches.length === 2) {
          // Pinch gesture ended - save final scale
          const finalScale = (scale as any)._value || 1;
          lastScale.current = finalScale;
          setCurrentZoomScale(finalScale);
        }
        
        // Detect horizontal swipe for flip (only when not zoomed and for months 1-12)
        // Works from both front to back AND back to front
        if (currentScale <= 1.01 && currentMonthIndex < 12 && evt.nativeEvent.touches.length === 0) {
          const swipeDistanceX = gestureState.dx;
          const swipeDistanceY = Math.abs(gestureState.dy);
          const velocityX = Math.abs(gestureState.vx);
          
          // More sensitive swipe detection - any horizontal swipe works (left or right)
          const isSwipe = (Math.abs(swipeDistanceX) > 25 || velocityX > 0.2) && 
                         Math.abs(swipeDistanceX) > swipeDistanceY * 1.3;
          
          if (isSwipe) {
            console.log('🔄 Swipe detected for flip:', { 
              swipeDistanceX, 
              velocityX, 
              isFlipped,
              direction: swipeDistanceX > 0 ? 'right' : 'left'
            });
            handleFlip();
            return;
          }
        }
        
        // Reset if zoomed out too much
          if (currentScale < 1.01) {
            Animated.parallel([
              Animated.spring(scale, {
                toValue: 1,
              friction: 7,
                tension: 40,
                useNativeDriver: true,
              }),
              Animated.spring(translateX, {
                toValue: 0,
              friction: 7,
                tension: 40,
                useNativeDriver: true,
              }),
              Animated.spring(translateY, {
                toValue: 0,
              friction: 7,
                tension: 40,
                useNativeDriver: true,
              }),
          ]).start(() => {
            lastScale.current = 1;
            lastTranslateX.current = 0;
            lastTranslateY.current = 0;
            setCurrentZoomScale(1);
          });
          } else {
            lastScale.current = currentScale;
          lastTranslateX.current = (translateX as any)._value || 0;
          lastTranslateY.current = (translateY as any)._value || 0;
          setCurrentZoomScale(currentScale);
        }
      },
    })
  ).current;

  const currentMonth = currentMonths[currentMonthIndex];
  const frontImageUrl = currentMonth.imageUrl;
  const backImageUrl = currentMonth.backImageUrl || currentMonth.imageUrl;
  
  // Debug logs
  console.log('🔍 DEBUG:', {
    selectedYear,
    currentMonthIndex,
    monthName: currentMonth.name,
    frontImageUrl,
    backImageUrl,
  });

  // Slide animation interpolations (bidirectional swipe effect)
  // Front to Back: front slides left (-SCREEN_WIDTH), back slides in from right (SCREEN_WIDTH -> 0)
  // Back to Front: back slides right (SCREEN_WIDTH), front slides in from left (-SCREEN_WIDTH -> 0)
  const frontTranslateX = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -SCREEN_WIDTH], // Front: 0 (visible) -> -SCREEN_WIDTH (hidden left)
  });

  const backTranslateX = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_WIDTH, 0], // Back: SCREEN_WIDTH (hidden right) -> 0 (visible)
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.5, 0],
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.5, 1],
  });

  const frontScale = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.9],
  });

  const backScale = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.yearSelector}
          onPress={() => setShowYearPicker(true)}
          testID="year-selector"
          activeOpacity={0.7}
        >
          <Text style={styles.yearText}>{selectedYear}</Text>
          <ChevronDown size={22} color="#F59E0B" strokeWidth={2.5} />
        </TouchableOpacity>

        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={styles.headerNavButton}
            onPress={goToPreviousMonth}
            testID="prev-month"
            activeOpacity={0.7}
          >
            <ChevronLeft size={26} color="#F59E0B" strokeWidth={2.5} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerNavButton}
            onPress={goToCurrentMonth}
            testID="home-button"
            activeOpacity={0.7}
          >
            <Home size={22} color="#F59E0B" strokeWidth={2.5} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerNavButton}
            onPress={goToNextMonth}
            testID="next-month"
            activeOpacity={0.7}
          >
            <ChevronRight size={26} color="#F59E0B" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setShowInfo(true)}
          testID="info-button"
          activeOpacity={0.7}
        >
          <Info size={24} color="#F59E0B" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      <View style={styles.monthNameContainer}>
        <Text style={styles.monthName}>
          {currentMonth.name} {selectedYear}
        </Text>
        <Text style={styles.monthNameHindi}>{currentMonth.hindiName}</Text>
      </View>

        <Animated.View
        ref={imageContainerRef}
        style={[styles.imageContainer, { opacity: imageOpacity }]}
          {...panResponder.panHandlers}
        // @ts-ignore - web only attribute
        dataSet={{ zoomArea: 'true' }}
      >
        {/* Loading Indicator */}
        {imageLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#F59E0B" />
            <Text style={styles.loadingText}>Loading image...</Text>
          </View>
        )}
        <View style={styles.flipWrapper}>
          {/* Front Card */}
          <Animated.View
          style={[
              styles.card,
              {
                transform: [
                  { translateX: frontTranslateX },
                  { scale: frontScale },
                ],
                opacity: frontOpacity,
                zIndex: isFlipped ? 1 : 2, // Front on top when not flipped
                elevation: isFlipped ? 1 : 2, // Android elevation
              },
            ]}
          >
            <Animated.View
              style={{
                width: '100%',
                height: '100%',
              transform: [
                { translateX: translateX },
                { translateY: translateY },
                { scale: scale },
              ],
              }}
            >
              <Image
                key={`front-${selectedYear}-${currentMonthIndex}-${isFlipped ? 'flipped' : 'normal'}`}
                source={{ uri: frontImageUrl }}
                style={styles.calendarImage}
                contentFit="contain"
                transition={300}
                cachePolicy="memory-disk"
                priority="high"
                onLoad={() => {
                  setImageLoading(false);
                }}
                onError={() => {
                  setImageLoading(false);
                  console.error('Failed to load image:', frontImageUrl);
                }}
              />
            </Animated.View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>FRONT</Text>
            </View>
          </Animated.View>

          {/* Back Card */}
          <Animated.View
            style={[
              styles.card,
              styles.cardBack,
              {
                transform: [
                  { translateX: backTranslateX },
                  { scale: backScale },
                ],
                opacity: backOpacity,
                zIndex: isFlipped ? 2 : 1, // Back on top when flipped
                elevation: isFlipped ? 2 : 1, // Android elevation
              },
            ]}
          >
            <Animated.View
              style={{
                width: '100%',
                height: '100%',
                transform: [
                  { translateX: translateX },
                  { translateY: translateY },
                  { scale: scale },
                ],
              }}
        >
          <Image
                key={`back-${selectedYear}-${currentMonthIndex}-${isFlipped ? 'flipped' : 'normal'}`}
                source={{ uri: backImageUrl }}
            style={styles.calendarImage}
            contentFit="contain"
                transition={300}
            cachePolicy="memory-disk"
            priority="high"
                onLoad={() => {
                  setImageLoading(false);
                }}
                onError={() => {
                  setImageLoading(false);
                  console.error('Failed to load image:', backImageUrl);
                }}
              />
            </Animated.View>
            <View style={[styles.badge, styles.badgeBack]}>
              <Text style={styles.badgeText}>BACK</Text>
            </View>
        </Animated.View>
      </View>

        {/* Zoom instruction hint */}
      {currentMonthIndex < 12 && (
          <View style={styles.hintContainer}>
            <Text style={styles.hintText}>
              {Platform.OS === 'web' 
                ? '🖱️ Scroll to Zoom | ↔️ Swipe to Flip (Both Ways)' 
                : '👆 Pinch to Zoom | ↔️ Swipe to Flip (Both Ways)'}
            </Text>
          </View>
        )}
        {currentMonthIndex >= 12 && (
          <View style={styles.hintContainer}>
            <Text style={styles.hintText}>
              {Platform.OS === 'web' 
                ? '🖱️ Scroll to Zoom' 
                : '👆 Pinch to Zoom'}
            </Text>
          </View>
        )}
      </Animated.View>

      {/* Modern Control Buttons */}
      <View style={styles.controlsContainer}>
        {/* Zoom Out */}
          <TouchableOpacity
          style={[
            styles.controlButton, 
            currentZoomScale <= 1 && styles.controlButtonDisabled,
            styles.iconButtonShadow
          ]}
          onPress={handleZoomOut}
          disabled={currentZoomScale <= 1}
          activeOpacity={0.8}
          testID="zoom-out"
        >
          <View style={styles.iconWrapper}>
            <ZoomOut 
              size={20} 
              color={currentZoomScale <= 1 ? "#9CA3AF" : "#F59E0B"} 
              strokeWidth={2}
            />
          </View>
          </TouchableOpacity>

        {/* Reset Zoom */}
        <TouchableOpacity
          style={[
            styles.controlButton, 
            currentZoomScale === 1 && styles.controlButtonDisabled,
            styles.iconButtonShadow
          ]}
          onPress={handleResetZoom}
          disabled={currentZoomScale === 1}
          activeOpacity={0.8}
          testID="reset-zoom"
        >
          <View style={styles.iconWrapper}>
            <RotateCcw 
              size={19} 
              color={currentZoomScale === 1 ? "#9CA3AF" : "#F59E0B"} 
              strokeWidth={2}
            />
        </View>
        </TouchableOpacity>

        {/* Flip Button - only for months 1-12 */}
        {currentMonthIndex < 12 && (
          <TouchableOpacity
            style={styles.flipButtonMain}
            onPress={handleFlip}
            activeOpacity={0.85}
            testID="flip-image"
          >
            <Animated.View
              style={{
                transform: [{
                  rotateZ: flipAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg'],
                  }),
                }],
              }}
            >
              <View style={styles.flipIconWrapper}>
                <FlipHorizontal size={24} color="#FFFFFF" strokeWidth={2} />
              </View>
            </Animated.View>
          </TouchableOpacity>
        )}

        {/* Zoom In */}
        <TouchableOpacity
          style={[
            styles.controlButton, 
            currentZoomScale >= 4 && styles.controlButtonDisabled,
            styles.iconButtonShadow
          ]}
          onPress={handleZoomIn}
          disabled={currentZoomScale >= 4}
          activeOpacity={0.8}
          testID="zoom-in"
        >
          <View style={styles.iconWrapper}>
            <ZoomIn 
              size={20} 
              color={currentZoomScale >= 4 ? "#9CA3AF" : "#F59E0B"} 
              strokeWidth={2}
            />
          </View>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showYearPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowYearPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowYearPicker(false)}
        >
          <View style={styles.yearPickerContainer}>
            <Text style={styles.pickerTitle}>Select Year</Text>
            <ScrollView
              ref={scrollViewRef}
              style={styles.yearList}
              showsVerticalScrollIndicator={true}
            >
              {YEARS.map((year) => (
                <TouchableOpacity
                  key={year}
                  style={[
                    styles.yearItem,
                    year === selectedYear && styles.yearItemSelected,
                  ]}
                  onPress={() => handleYearSelect(year)}
                  testID={`year-${year}`}
                >
                  <Text
                    style={[
                      styles.yearItemText,
                      year === selectedYear && styles.yearItemTextSelected,
                    ]}
                  >
                    {year}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={showInfo}
        transparent
        animationType="fade"
        onRequestClose={() => setShowInfo(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowInfo(false)}
        >
          <View style={styles.infoContainer}>
            <View style={styles.infoHeader}>
              <Info size={32} color="#D97706" />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>प्रकाशक : अमर ग्रन्थालय</Text>
              <Text style={styles.infoText}>प्राप्ति स्थान : श्री दिगम्बर उदासीन आश्रम,</Text>
              <Text style={styles.infoText}>584, M G road, behind 56 dukan, Indore</Text>
              <Text style={styles.infoText}>मोब:</Text>
              <View style={styles.phoneContainer}>
                <TouchableOpacity
                  onPress={() => Linking.openURL('tel:9425478846')}
                  onLongPress={async () => {
                    await Clipboard.setStringAsync('9425478846');
                    Alert.alert('Copied', 'Phone number copied to clipboard');
                  }}
                  style={styles.phoneButton}
                >
                  <Text style={styles.phoneText}>9425478846</Text>
                </TouchableOpacity>
                <Text style={styles.phoneSeperator}> </Text>
                <TouchableOpacity
                  onPress={() => Linking.openURL('tel:9770872087')}
                  onLongPress={async () => {
                    await Clipboard.setStringAsync('9770872087');
                    Alert.alert('Copied', 'Phone number copied to clipboard');
                  }}
                  style={styles.phoneButton}
                >
                  <Text style={styles.phoneText}>9770872087</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowInfo(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  navigationButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerNavButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#FDE68A",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  yearSelector: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#FDE68A",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  yearText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginRight: 8,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#FDE68A",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  monthNameContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  monthName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
  },
  monthNameHindi: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
  imageContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "600",
  },
  flipWrapper: {
    width: SCREEN_WIDTH,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: SCREEN_WIDTH,
    height: "100%",
    position: "absolute",
    backfaceVisibility: "hidden",
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  cardBack: {
    position: "absolute",
  },
  calendarImage: {
    width: "100%",
    height: "100%",
  },
  badge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(217, 119, 6, 0.85)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeBack: {
    backgroundColor: "rgba(59, 130, 246, 0.85)",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  hintContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  hintText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    fontWeight: "600",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  controlsContainer: {
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#FDE68A",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  iconButtonShadow: {
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  controlButtonDisabled: {
    backgroundColor: "#F9FAFB",
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    elevation: 1,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  flipButtonMain: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F59E0B",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0,
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  flipIconWrapper: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  yearPickerContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    width: SCREEN_WIDTH * 0.8,
    maxHeight: 500,
  },
  pickerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 16,
    textAlign: "center",
  },
  yearList: {
    maxHeight: 400,
  },
  yearItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#F9FAFB",
  },
  yearItemSelected: {
    backgroundColor: "#FEF3C7",
    borderWidth: 2,
    borderColor: "#F59E0B",
  },
  yearItemText: {
    fontSize: 16,
    color: "#374151",
    textAlign: "center",
    fontWeight: "600",
  },
  yearItemTextSelected: {
    color: "#D97706",
    fontWeight: "700",
  },
  infoContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    width: SCREEN_WIDTH * 0.85,
  },
  infoHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  infoTextContainer: {
    marginBottom: 16,
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 4,
  },
  infoTitle: {
    fontSize: 18,
    lineHeight: 28,
    color: "#1F2937",
    textAlign: "center",
    fontWeight: "700",
    marginBottom: 6,
    width: "100%",
    flexWrap: "wrap",
  },
  infoText: {
    fontSize: 15,
    lineHeight: 24,
    color: "#4B5563",
    textAlign: "center",
    width: "100%",
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 4,
    gap: 8,
  },
  phoneSeperator: {
    width: 4,
  },
  phoneButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "#FEF3C7",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#F59E0B",
  },
  phoneText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#D97706",
  },
  closeButton: {
    backgroundColor: "#F59E0B",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
