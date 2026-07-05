# Screenshots

Binary screenshot files are intentionally not committed to the repository.

On pull requests, the `motion-canvas-previews` GitHub Actions workflow generates representative PNG preview frames for changed video folders and uploads them as a workflow artifact named `motion-canvas-screenshots`.

To generate previews locally for this video:

```bash
npm run screenshots:backprop
```
