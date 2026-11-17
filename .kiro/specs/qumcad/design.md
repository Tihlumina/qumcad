# Design Document: Qumcad

## Overview
(Brief project overview)

## Architecture
(Place your original architecture diagram, component relationships, data flow content here)

## Components and Interfaces
(Original content about Interlocking Engine, Topology Oracle, PBT Exorcist, UI)

## Data Models
(Original type definitions)

## Correctness Properties
(Original P1 / P2 properties)## Correctness Properties

### Property 1: No Conflicting Routes

*For any* lever configuration, no two active routes should occupy overlapping physical track blocks.

**Validates: Requirements 2.1, 6.1**

### Property 2: Signal-Point Lock Integrity

*For any* lever configuration with an active signal, all required points must be aligned and FPLs plunged.

**Validates: Requirements 1.1, 1.2, 6.1**

## Error Handling
(Original error handling content)

## Testing Strategy
(Original testing strategy content)