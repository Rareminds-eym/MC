import React from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import { useState } from 'react';
import { Term } from '../../types/Level2/types';
import DraggableTerm from './DraggableTerm';
import { useDeviceLayout } from '../../hooks/useOrientation';
import './index.css';

interface DndProviderProps {
  children: React.ReactNode;
  onDragStart?: (event: DragStartEvent) => void;
  onDragEnd?: (event: DragEndEvent) => void;
  onDragOver?: (event: DragOverEvent) => void;
}

const DndProvider: React.FC<DndProviderProps> = ({
  children,
  onDragStart,
  onDragEnd,
  onDragOver
}) => {
  const [activeItem, setActiveItem] = useState<Term | null>(null);
  const { isMobile } = useDeviceLayout();

  // Ultra-simple sensors for easy mobile drag and drop
  const sensors = useSensors(
    // Mouse sensor for desktop
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 3, // Very low distance
      },
    }),
    // Touch sensor with minimal constraints for mobile
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 0, // No delay for immediate response
        tolerance: 15, // High tolerance for easier touch
      },
    }),
    // Pointer sensor with ultra-low constraints for mobile
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: isMobile ? 1 : 3, // Almost no distance for mobile
        delay: 0, // No delay
        tolerance: isMobile ? 15 : 5, // Very high tolerance for mobile
      },
    })
  );

  // Simple haptic feedback for mobile devices
  const triggerHapticFeedback = (intensity: 'light' | 'medium' | 'strong' = 'light') => {
    if (!isMobile || !('vibrate' in navigator)) return;

    const patterns = {
      light: 15,
      medium: 30,
      strong: [40, 20, 40]
    };

    navigator.vibrate(patterns[intensity]);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const draggedItem = active.data.current as Term;

    setActiveItem(draggedItem);

    // Provide haptic feedback on drag start
    triggerHapticFeedback('strong');

    // Call parent handler
    onDragStart?.(event);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over } = event;

    // Provide appropriate haptic feedback
    if (over) {
      triggerHapticFeedback('strong'); // Successful drop
    } else {
      triggerHapticFeedback('light'); // Cancelled drop
    }

    // Reset state
    setActiveItem(null);

    // Call parent handler
    onDragEnd?.(event);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;

    // Light haptic feedback when hovering over valid drop zones
    if (over && isMobile) {
      triggerHapticFeedback('light');
    }

    // Call parent handler
    onDragOver?.(event);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      {children}





      <DragOverlay>
        {activeItem ? (
          <div className={`relative ${isMobile ? 'transform scale-110' : 'transform rotate-1 scale-105'} opacity-95 shadow-2xl`}>
            {/* Simple glow effect */}
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-500 opacity-50 rounded-lg blur-sm"></div>

            {/* Dashed border indicator */}
            <div className="absolute -inset-1 border-2 border-dashed border-cyan-400 rounded-lg"></div>

            {/* Mobile-specific drag indicators */}
            {isMobile && (
              <>
                {/* Top indicator dots */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 bg-yellow-400 rounded-full"
                      style={{ animationDelay: `${i * 100}ms` }}
                    ></div>
                  ))}
                </div>

                {/* Side indicator */}
                <div className="absolute top-1/2 -right-8 transform -translate-y-1/2">
                  <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                    📱
                  </div>
                </div>
              </>
            )}

            {/* The actual draggable term */}
            <DraggableTerm
              term={activeItem}
              showResults={false}
              isDragOverlay={true}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default DndProvider;