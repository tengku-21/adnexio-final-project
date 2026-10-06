<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;
use Laravel\Sanctum\PersonalAccessToken;


class ApiTest extends TestCase
{
    use RefreshDatabase;

    private string $token;

    private User $admin;

    private User $customer;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();

        $this->admin = User::where('role', 'admin')->firstOrFail();

        $this->customer = User::where('role', 'customer')->firstOrFail();

        // Login first
        $response = $this->postJson('/api/auth/login', [
            'email' => $this->customer->email,
            'password' => 'password',
        ]);

        $response->assertSuccessful();

        $this->token = $response->json('token');
    }

    private function authenticated()
    {
        return $this->withHeader(
            'Authorization',
            'Bearer ' . $this->token
        );
    }

    // Tests go here...

    //test untuk login
    public function test_customer_can_login(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => $this->customer->email,
            'password' => 'password',
        ]);

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'user' => [
                    'id',
                    'name',
                    'email',
                    'role',
                ],
                'token',
            ]);

        $this->assertNotEmpty($response->json('token'));
    }

    public function test_invalid_login_is_rejected(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => $this->customer->email,
            'password' => 'wrong-password',
        ]);

        $response
            ->assertStatus(401)
            ->assertJson([
                'message' => 'Invalid credentials.',
            ]);
    }

    public function test_authenticated_user_can_get_their_profile(): void
    {
        $response = $this->authenticated()
            ->getJson('/api/auth/me');

        $response
            ->assertStatus(200)
            ->assertJson([
                'id' => $this->customer->id,
                'email' => $this->customer->email,
                'role' => 'customer',
            ]);
    }

    //test for users
    public function test_customer_can_view_their_own_user(): void
    {
        $response = $this->authenticated()
            ->getJson('/api/users/' . $this->customer->id);

        $response
            ->assertStatus(200)
            ->assertJson([
                'id' => $this->customer->id,
                'email' => $this->customer->email,
            ]);
    }

    public function test_customer_cannot_view_another_user(): void
    {
        $otherCustomer = User::where('id', '!=', $this->customer->id)
            ->where('role', 'customer')
            ->firstOrFail();

        $response = $this->authenticated()
            ->getJson('/api/users/' . $otherCustomer->id);

        $response->assertStatus(403);
    }

    public function test_admin_can_view_users(): void
    {
        $token = $this->loginAs($this->admin);

        $response = $this->withToken($token)
            ->getJson('/api/users');

        $response->assertStatus(200);
    }

    private function loginAs(User $user): string
    {
        return $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'password',
        ])->json('token');
    }

    //test for packages
    public function test_customer_can_list_their_packages(): void
    {
        $response = $this->authenticated()
            ->getJson('/api/packages');

        $response->assertStatus(200);

        $response->assertJsonStructure([
            'data',
            'current_page',
            'per_page',
            'total',
        ]);
    }

    public function test_admin_can_create_a_package(): void
    {
        $response = $this->authenticated()
            ->postJson('/api/packages', [
                'name' => 'Test Customer',
                'detail' => 'Premium subscription package',
                'amount' => 200.00,
                'currency' => 'MYR'
            ]);

        $response
            ->assertStatus(201)
            ->assertJson([
                'name' => 'Test Customer',
                'detail' => 'Premium subscription package',
                'amount' => 200.00,
                'currency' => 'MYR'
            ]);

        $this->assertDatabaseHas('packages', [
            'name' => 'Test Customer',
        ]);
    }


    //test for orders
    public function test_customer_can_list_their_orders(): void
    {
        $response = $this->authenticated()
            ->getJson('/api/orders');

        $response->assertStatus(200);

        $response->assertJsonStructure([
            'data',
            'current_page',
            'per_page',
            'total',
        ]);
    }

    public function test_customer_only_sees_their_own_orders(): void
    {
        $response = $this->authenticated()
            ->getJson('/api/orders');

        $orders = $response->json('data');

        foreach ($orders as $order) {
            $this->assertEquals(
                $this->customer->id,
                $order['user_id']
            );
        }
    }

    public function test_customer_can_create_an_order(): void
    {
        $response = $this->authenticated()
            ->postJson('/api/orders', [
                'name' => 'Test Customer',
                'email'=> 'guest@example.com',
                'phone' => '0123456789',
                'location' => 'Puchong, Selangor',
            ]);

        $response
            ->assertStatus(201)
            ->assertJson([
                'name' => 'Test Customer',
                'phone' => '0123456789',
                'location' => 'Puchong, Selangor',
                'user_id' => $this->customer->id,
            ]);

        $this->assertDatabaseHas('orders', [
            'name' => 'Test Customer',
            'user_id' => $this->customer->id,
        ]);
    }

    // public function test_guest_can_create_an_order(): void
    // {
    //     $response = $this->postJson('/api/orders', [
    //         'name' => 'Guest Customer',
    //         'email' => 'guest@example.com',
    //         'phone' => '0123456789',
    //         'location' => 'Kuala Lumpur',
    //     ]);

    //     $response
    //         ->assertStatus(201)
    //         ->assertJson([
    //             'name' => 'Guest Customer',
    //             'user_id' => null,
    //         ]);
    // }

    public function test_customer_cannot_view_another_customers_order(): void
    {
        $otherOrder = Order::where('user_id', '!=', $this->customer->id)
            ->whereNotNull('user_id')
            ->firstOrFail();

        $response = $this->authenticated()
            ->getJson('/api/orders/' . $otherOrder->id);

        $response->assertStatus(403);
    }

    public function test_customer_can_view_their_own_order(): void
    {
        $order = Order::where('user_id', $this->customer->id)
            ->firstOrFail();

        $response = $this->authenticated()
            ->getJson('/api/orders/' . $order->id);

        $response
            ->assertStatus(200)
            ->assertJson([
                'id' => $order->id,
                'user_id' => $this->customer->id,
            ]);
    }

    //Payment test

    public function test_customer_can_list_their_payments(): void
    {
        $response = $this->authenticated()
            ->getJson('/api/payments');

        $response->assertStatus(200);
    }

    public function test_customer_can_create_payment(): void
    {
        $order = Order::where('user_id', $this->customer->id)
            ->firstOrFail();

        $response = $this->authenticated()
            ->postJson('/api/payments', [
                'order_id' => $order->id,
                'name' => 'John Doe',
                'phone' => '0123456789',
                'amount' => 150.00,
                'currency' => 'MYR',
                'gateway' => 'ipay88',
                'method' => 'online_banking',
            ]);

        $response
            ->assertStatus(201)
            ->assertJson([
                'order_id' => $order->id,
                'user_id' => $this->customer->id,
                'status' => 'pending',
            ]);
    }

    // public function test_guest_can_create_payment(): void
    // {
    //     $order = Order::whereNull('user_id')->firstOrFail();

    //     $response = $this->postJson('/api/payments', [
    //         'order_id' => $order->id,
    //         'name' => 'Guest Customer',
    //         'phone' => '0167890123',
    //         'amount' => 100.00,
    //         'currency' => 'MYR',
    //         'gateway' => 'ipay88',
    //         'method' => 'credit_card',
    //     ]);

    //     $response
    //         ->assertStatus(201)
    //         ->assertJson([
    //             'order_id' => $order->id,
    //             'user_id' => null,
    //             'status' => 'pending',
    //         ]);
    // }

    public function test_customer_cannot_change_payment_status(): void
    {
        $payment = Payment::where('user_id', $this->customer->id)
            ->firstOrFail();

        $originalStatus = $payment->status;

        $this->authenticated()
            ->putJson('/api/payments/' . $payment->id, [
                'status' => 'paid',
            ]);

        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'status' => $originalStatus,
        ]);
    }


    //test untuk documents

    public function test_customer_can_list_documents(): void
    {
        $response = $this->authenticated()
            ->getJson('/api/documents');

        $response->assertStatus(200);
    }

    public function test_customer_can_upload_a_document(): void
    {
        $order = Order::where('user_id', $this->customer->id)
            ->firstOrFail();

        $file = UploadedFile::fake()->create(
            'receipt.pdf',
            100,
            'application/pdf'
        );

        $response = $this->authenticated()
            ->postJson('/api/documents', [
                'order_id' => $order->id,
                'file' => $file,
            ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('documents', [
            'order_id' => $order->id,
            'original_name' => 'receipt.pdf',
        ]);
    }

    //logout
public function test_logout_invalidates_the_current_token(): void
{
    $before = PersonalAccessToken::findToken($this->token);

    dump([
        'token' => $this->token,
        'id' => $before?->id,
        'db_token' => $before?->token,
    ]);

    $this->authenticated()
        ->postJson('/api/auth/logout')
        ->assertOk();

    $after = PersonalAccessToken::findToken($this->token);

    dump([
        'after_logout_id' => $after?->id,
    ]);

    $this->authenticated()
        ->getJson('/api/auth/me')
        ->assertUnauthorized();
}



}