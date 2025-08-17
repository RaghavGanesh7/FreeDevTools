.PHONY: build deploy run clean

# Build the project
build:
	npm run build

# Deploy: build first, then rsync to server
deploy: build
	rsync -avz ./dist/ master:/tools/

# Run development server
run:
	npm run dev

# Clean build artifacts
clean:
	rm -rf dist/
	rm -rf .astro/ 