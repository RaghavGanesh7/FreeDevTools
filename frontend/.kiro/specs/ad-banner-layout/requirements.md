# Requirements Document

## Introduction

This feature involves redesigning the site layout to remove the sidebar navigation and introduce a fixed advertisement banner. The banner will be positioned on the right side for desktop/laptop screens and at the top for tablet and mobile devices. The banner will use a swiper component to display rotating advertisements with images, titles, and descriptions.

## Requirements

### Requirement 1

**User Story:** As a site visitor, I want the sidebar to be temporarily hidden so that I have more screen real estate for the main content.

#### Acceptance Criteria

1. WHEN a user visits any page THEN the sidebar SHALL be commented out but not deleted from the codebase
2. WHEN viewing the layout THEN the main content SHALL expand to use the full available width
3. WHEN examining the code THEN the sidebar components SHALL remain intact for future use

### Requirement 2

**User Story:** As a site owner, I want to display advertisements in a fixed banner so that I can monetize the site effectively.

#### Acceptance Criteria

1. WHEN a user visits the site on desktop/laptop THEN the ad banner SHALL be positioned as a fixed element on the right side
2. WHEN a user visits the site on tablet or mobile THEN the ad banner SHALL be positioned at the top of the content area
3. WHEN the banner is displayed THEN it SHALL remain visible during scrolling (fixed positioning)
4. WHEN multiple ads are available THEN the banner SHALL cycle through them using a swiper component

### Requirement 3

**User Story:** As a site visitor, I want to see visually appealing advertisements that don't interfere with my browsing experience.

#### Acceptance Criteria

1. WHEN an advertisement is displayed THEN it SHALL include a title, image, and description
2. WHEN viewing ads THEN they SHALL use the existing site color scheme and styling
3. WHEN on mobile devices THEN the ad banner SHALL be responsive and not break the layout
4. WHEN swiping is available THEN users SHALL be able to manually navigate between ads
5. WHEN the swiper is active THEN it SHALL auto-advance through advertisements at regular intervals

### Requirement 4

**User Story:** As a developer, I want the advertisement system to be modular and easily maintainable.

#### Acceptance Criteria

1. WHEN implementing the ads THEN there SHALL be a dedicated Ad component (Ad.astro or Ad.tsx)
2. WHEN adding the swiper functionality THEN the "swiper" library version ^11.2.7 SHALL be installed
3. WHEN displaying ads THEN the component SHALL use the existing ad images (ad1.png, ad2.png, ad3.png, ad4.png)
4. WHEN styling the ads THEN they SHALL use Tailwind CSS with the site's existing color palette
5. WHEN integrating the banner THEN it SHALL be added to the BaseLayout component for site-wide availability