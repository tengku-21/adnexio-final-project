<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index()
    {
        return response()->json(
            Payment::with(['order', 'user'])->paginate(20)
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'order_id' => ['required', 'exists:orders,id'],
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'amount' => ['required', 'numeric', 'min:0'],
            'currency' => ['sometimes', 'string', 'size:3'],
            'gateway' => ['sometimes', 'string'],
            'method' => ['nullable', 'string'],
        ]);

        $data['user_id'] = $request->user()?->id;
        $data['status'] = 'paid'; //harcode to paid

        $payment = Payment::create($data);

        return response()->json($payment, 201);
    }

    public function show(Payment $payment)
    {
        return response()->json(
            $payment->load(['order', 'user'])
        );
    }

    public function update(Request $request, Payment $payment)
    {
        // For now, only allow limited updates.
        $data = $request->validate([
            'method' => ['sometimes', 'string'],
        ]);

        $payment->update($data);

        return response()->json($payment);
    }
}