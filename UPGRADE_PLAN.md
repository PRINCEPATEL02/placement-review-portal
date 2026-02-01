# Upgrade Plan: Real-Time SPA & Performance Optimization

## 🚀 Goals Implementation Status

### 1. Frontend Improvements (React Query Integration)
- **Status**: ✅ Implemented for `StudentHome`.
- **Changes**:
    - Installed `@tanstack/react-query`.
    - Wrapped app in `QueryClientProvider` with global config (1 min stale time, window focus refetching).
    - Refactored `StudentHome.jsx` to use `useQuery`.
    - **Benefit**: No more full page reloads, "instant" feel with caching, background polling every 5 seconds for near real-time updates.
    - **Optimization**: Used `useMemo` for client-side filtering to prevent unnecessary re-renders.

### 2. Backend Improvements (Database & API)
- **Status**: ✅ Implemented.
- **Changes**:
    - **Indexing**: Added MongoDB indexes to `Post` model for `enrollment`, `status`, `created_at`, and `company_name` (text index).
    - **API Optimization**: Updated `getReviews` controller:
        - Uses `.lean()` for faster query execution.
        - Uses `.select(...)` to return only required fields (reduced payload size).
        - Optimized "Author Name" population to reduce database round-trips.

## 📋 Next Steps (Recommended)

### Phase 2: Complete SPA Conversion
1. **Admin Panel**: Apply `useQuery` to `ManageReviews.jsx` (Admin panel usually needs auto-refresh too).
2. **Mutations & Optimistic Updates**:
    - For `AddReview.jsx`: Use `useMutation` and `queryClient.invalidateQueries(['reviews'])` on success.
    - For "Like" button: Use `onMutate` to instantly update the UI (heart turns red) before the API call finishes.

### Phase 3: Advanced Real-Time
- If polling (5s) is not fast enough, integrate **Socket.IO**:
    - Backend: Emit events on `post.save()`.
    - Frontend: Listen for events and call `queryClient.invalidateQueries()`.

## ⚡ Performance Checklist
- [x] Database Indexes (Created)
- [x] Lean Queries (Implemented)
- [x] Field Selection (Implemented)
- [x] Client-Side Caching (React Query)
- [x] Memoization (useMemo in StudentHome)

## 📝 Code Snippets

### Before (StudentHome.jsx)
```javascript
const [reviews, setReviews] = useState([]);
useEffect(() => {
  fetch('/api/reviews').then(res => res.json()).then(data => setReviews(data));
}, []);
```

### After (StudentHome.jsx)
```javascript
const { data: reviews } = useQuery({
  queryKey: ['reviews'],
  queryFn: fetchReviews,
  refetchInterval: 5000, // Live updates
});
```
