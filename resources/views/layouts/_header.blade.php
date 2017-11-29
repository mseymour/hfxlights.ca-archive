<nav class="overlay-nav">
    <a class="overlay-nav__home" href="{{ url('/') }}"><span>{{ config('app.name', 'HFXLights') }}</span></a>
    <div class="overlay-nav__user">
        <ul class="navbar-nav ml-auto">
        @guest
            <li class="nav-item"><a class="nav-link" href="{{ route('login') }}">@lang('app.navigation.login')</a></li>
            <li class="nav-item"><a class="nav-link" href="{{ route('register') }}">@lang('app.navigation.register')</a></li>
        @else
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {{ Auth::user()->name }}
                </a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                    <a class="dropdown-item" href="#">My Profile</a>
                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item" href="{{ route('logout') }}"
                        onclick="event.preventDefault();
                                 document.getElementById('logout-form').submit();">
                        @lang('app.navigation.logout')
                    </a>
                    <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                        {{ csrf_field() }}
                    </form>
                </div>
            </li>
        @endguest
        </ul>
    </div>
    @stack('overlay-nav')
</nav>
