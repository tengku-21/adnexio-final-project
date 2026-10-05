<?php

namespace App\Http\Controllers;

use App\Models\Package;
use Illuminate\Http\Request;

class PackageController extends Controller
{
    public function index()
    {
        return response()->json(
            Package::with('user')->paginate(20)
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'detail' => ['nullable', 'string'],
        ]);

        $data['user_id'] = $request->user()?->id;

        $package = Package::create($data);

        return response()->json($package, 201);
    }

    public function show(Package $package)
    {
        return response()->json(
            $package->load('user')
        );
    }

    public function update(Request $request, Package $package)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'detail' => ['sometimes', 'string'],
        ]);

        $package->update($data);

        return response()->json($package);
    }

    public function destroy(Package $package)
    {
        $package->delete();

        return response()->json([
            'message' => 'Package deleted successfully.',
        ]);
    }
}
